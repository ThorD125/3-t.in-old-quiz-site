import json

def parse_file_to_json(file_path):
    questions = []
    current_question = None
    options = {}
    option_labels = ["A", "B", "C", "D"]  # Add or extend this if you expect more than 4 options
    current_label = 0

    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()

            if not line:
                continue  # Skip empty lines

            # Detect new question
            if line.startswith("###"):
                # If there's a previous question, save it before starting a new one
                if current_question:
                    current_question["options"] = options
                    questions.append(current_question)
                current_question = {
                    "question": line[4:].strip(),  # Remove "### " from the line
                    "options": {},
                    "answer": ""
                }
                options = {}
                current_label = 0

            # Detect options (unchecked)
            elif line.startswith("- [ ]"):
                if current_label < len(option_labels):
                    options[option_labels[current_label]] = line[6:].strip()  # Remove "- [ ] "
                    current_label += 1
                else:
                    print(f"Warning: Too many options for question: {current_question['question']}")

            # Detect correct answer (checked)
            elif line.startswith("- [x]"):
                if current_label < len(option_labels):
                    options[option_labels[current_label]] = line[6:].strip()  # Remove "- [x] "
                    current_question["answer"] = option_labels[current_label]
                    current_label += 1
                else:
                    print(f"Warning: Too many options for question: {current_question['question']}")

    # Append the last question after finishing the file
    if current_question:
        current_question["options"] = options
        questions.append(current_question)

    return questions

# File path to the input text file
file_path = 'questions.txt'
questions_data = parse_file_to_json(file_path)

# Output the parsed data as JSON
with open('questions.json', 'w', encoding='utf-8') as json_file:
    json.dump(questions_data, json_file, indent=4)

print("Questions have been successfully converted to JSON format.")
