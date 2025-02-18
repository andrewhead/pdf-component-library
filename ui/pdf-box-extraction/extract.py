import re
import argparse
from collections import defaultdict
import json

import pysbd
from papermage.recipes import CoreRecipe


def find_boxes(search_strings, document):

    sentence_segmenter = pysbd.Segmenter(language="en", clean=False)
    boxes = defaultdict(list)

    # Search for each of the search strings, and find bounding boxes for
    # each of those search strings if we can find them in the text.
    for paragraph in document.paragraphs:
        for search_string in search_strings:
            search_sents = sentence_segmenter.segment(search_string)
            for search_sent in search_sents:
                for sentence in paragraph.sentences:
                    
                    # Do a fuzzy match tolerant to differences in space and punctuation
                    # between search_sent and sentence.text.
                    search_sent_normalized = re.sub(r"\s+", " ", search_sent)
                    search_sent_normalized = re.sub(r"[^\w ]+", "_", search_sent_normalized)
                    sentence_normalized = re.sub(r"\s+", " ", sentence.text)
                    sentence_normalized = re.sub(r"[^\w ]+", "_", sentence_normalized)

                    if search_sent_normalized == sentence_normalized:
                        for token in sentence.tokens:
                            for box in token.boxes:
                                boxes[search_string].append({
                                    "left": box.l,
                                    "top": box.t,
                                    "width": box.w,
                                    "height": box.h,
                                    "page": box.page
                                })

    # Output bounding boxes for sentences to a JSON file.
    output_data = []
    for search_string, search_boxes in boxes.items():
        output_data.append({
            "passage": search_string,
            "boxes": search_boxes,
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

    parser = argparse.ArgumentParser()
    parser.add_argument("--input-pdf", help="PDF to search for strings.", required=True)
    parser.add_argument("--search-strings", help="JSON file containing search strings.", required=True)
    parser.add_argument("--output-path", help="File to output found bounding boxes.", required=True)
    args = parser.parse_args()

    with open(args.search_strings, "r") as f:
        search_strings = json.load(f)
    
    run(args.input_pdf, search_strings, args.output_path)
