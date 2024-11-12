import requests
import json

# Variables
courseID = 50
authorizationToken = "Bearertoken"

# URL and headers
url = f"https://learn.microsoft.com/api/skillassessment/practice/assessments/{courseID}/sessions"
headers = {
    "Authorization": authorizationToken,
    "Referer": f"https://learn.microsoft.com/en-us/credentials/certifications/microsoft-365-fundamentals/practice/assessment?assessment-type=practice&assessmentId={courseID}&practice-assessment-type=certification&source=docs"
}

# List to accumulate all unique questions and a set to track unique texts
all_questions = []
unique_texts = set()

# Repeat the request 10 times
for _ in range(10):
    # Sending the POST request
    response = requests.post(url, headers=headers)

    # Check if the response is successful
    if response.status_code == 200:
        data = response.json()
        
        # Extract and filter unique questions based on `text`
        for questionnaire in data.get("questionnaires", []):
            for question in questionnaire["questions"]:
                question_text = question["text"]
                
                # Check if this text is unique
                if question_text not in unique_texts:
                    unique_texts.add(question_text)  # Mark this text as seen
                    filtered_question = {
                        "type": question["type"],
                        "text": question_text,
                        "choices": [
                            {
                                "text": choice["text"],
                                "isCorrect": choice["isCorrect"]
                            }
                            for choice in question["choices"]
                        ]
                    }
                    all_questions.append(filtered_question)  # Add the unique question
    else:
        print(f"Failed to retrieve data on attempt {_+1}. Status Code:", response.status_code)

# Write the combined unique questions to a file
with open("combined_unique_questions.json", "w") as file:
    json.dump(all_questions, file, indent=4)

print("Combined unique questions from 10 requests have been written to 'combined_unique_questions.json'")


# Load the original JSON data
with open('combined_unique_questions.json', 'r') as file:
    original_data = json.load(file)

# Initialize a list to hold the transformed questions
transformed_data = []

# Process each question in the original data
for question_index, question in enumerate(original_data):
    # Create the new question structure
    transformed_question = {
        "question": question["text"].strip(),
        "options": {},
        "answer": []
    }
    
    # Populate options and find the correct answer index
    for i, choice in enumerate(question["choices"]):
        transformed_question["options"][str(i)] = choice["text"]
        if choice["isCorrect"]:
            transformed_question["answer"].append(i)
    
    # Add the transformed question to the list
    transformed_data.append(transformed_question)

# Save the transformed data to a new JSON file
with open('transformed_questions.json', 'w') as output_file:
    json.dump(transformed_data, output_file, indent=4)

print("Transformation complete. Data saved to 'transformed_questions.json'.")
