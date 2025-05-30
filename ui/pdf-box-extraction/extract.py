import re
import argparse
from collections import defaultdict
import json
from difflib import SequenceMatcher
import sys
import os

from papermage.recipes import CoreRecipe

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from storing_agreement import (
    summarize1, summarize2, summarize3, summarize4, summarize5,
    summarize6, summarize7, summarize8, summarize9, summarize10, summarize11
)

summarize_dicts = [
    summarize1, summarize2, summarize3, summarize4, summarize5,
    summarize6, summarize7, summarize8, summarize9, summarize10, summarize11
]

def find_paragraph(string, document):
    # Utility function generated by Copilot to help us debug when a search
    # string has not been found in the document.
    for paragraph in document.paragraphs:
        for sentence in paragraph.sentences:
            if string in sentence.text:
                return paragraph
    return None


def find_boxes(search_strings, document):

    boxes = defaultdict(list)

    # The idea behind passage matching is to look for token sequences that
    # closely match the search string. But it has to be tolerant to differences, because exact
    # matches are thwarted by things like ligatures, that make the PDF token
    # stream different from the text we processed in the backend.
    for search_string in search_strings:
        
        search_string = search_string.strip()
        first_search_token = search_string.split()[0]
        first_search_token = re.sub(r'[^\w\s]', '', first_search_token)
        search_sent_found = False
        
        doc_tokens = list(document.tokens)
        for start_token_index, token in enumerate(document.tokens):
            
            # Check to see if this one token might be the start of a match...
            # XXX(andrewhead): it would be great to have a search system that
            # was more resistant to issues than needing an exact match on the first
            # token. Maybe in a second pass we can do a match on the second token.
            if token.text == first_search_token:
                
                # Then, assemble list of tokens that might just match this search string.
                potential_match_tokens = [token]
                token_lookahead = token.text
                lookahead_index = start_token_index + 1
                
                # ... put together those tokens until you have a string of about the same length...
                while len(token_lookahead) < len(search_string) and lookahead_index < len(doc_tokens):
                    token_lookahead += (" " + doc_tokens[lookahead_index].text)
                    potential_match_tokens.append(doc_tokens[lookahead_index])
                    lookahead_index += 1
                
                # Once enough characters have been collected, check for a match.
                # TODO(andrewhead): extend the PDF token stream enough to get to the end
                # of a sentence. Right now, this will probably stop partway through the matching
                # sentence. That seems like a problem for a lter time...
                if SequenceMatcher(None, token_lookahead, search_string).ratio() > 0.8:
                    for t in potential_match_tokens:
                        for box in t.boxes:
                            boxes[search_string].append({
                                "left": box.l,
                                "top": box.t,
                                "width": box.w,
                                "height": box.h,
                                "page": box.page
                            })
                
                    search_sent_found = True
                    break                
                
        if not search_sent_found:
            print("Could not find search string:")
            print(search_string)

    # Output bounding boxes for sentences to a JSON file.
    output_data = []
    for search_string, search_boxes in boxes.items():
        explanation = None
        for summarize_dict in summarize_dicts:
            for key, value_list in summarize_dict.items():
                for value in value_list:
                    if value in value_list:
                        if value[2] == search_string:
                            explanation = value[5]
                            break
                if explanation:
                    break
            if explanation:
                break
                
        output_data.append({
            "passage": search_string,
            "boxes": search_boxes,
            "explanation": explanation,
        })
    
    return output_data


def run(pdf_name, search_strings, output_path):
    # Load in paper with the Semantic Reader PaperMage
    recipe = CoreRecipe()
    doc = recipe.run(pdf_name)

    boxes = find_boxes(search_strings, doc)
    with open(output_path, "w") as f:
        f.write(json.dumps(boxes, indent=2))


if __name__ == "__main__":
    # Example usage
    # paper_name = "explainable-notes"
    # pdf_path = f"{paper_name}.pdf"
    # search_strings = [(
    #   "Patients commented on aspects of progress notes " +
    #   "that they found valuable. We describe them here to highlight what " +
    #   "kind of outcomes would be achieved better if patients receive adequate " +
    #   "support for reading their notes.",
    # )]
    # run(pdf_path, search_strings, f"{paper_name}_boxes.json")

    # Silence warnings from "WARNING:papermage.magelib.entity".
    # I'm not sure how to silence them and they get in the way of getting debugging output.
    import logging
    logging.getLogger("papermage.magelib.entity").setLevel(logging.ERROR)

    parser = argparse.ArgumentParser()
    parser.add_argument("--input-pdf", help="PDF to search for strings.", required=True)
    parser.add_argument("--search-strings", help="JSON file containing search strings.", required=True)
    parser.add_argument("--output-path", help="File to output found bounding boxes.", required=True)
    args = parser.parse_args()

    with open(args.search_strings, "r") as f:
        search_strings = json.load(f)
    
    run(args.input_pdf, search_strings, args.output_path)
