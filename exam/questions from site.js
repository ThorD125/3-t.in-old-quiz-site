// https://www.dumpsbase.com/freedumps/download-ms-900-exam-dumps-pdf-v15-02-to-prepare-for-microsoft-365-fundamentals-exam.html
// submit questions
// get the one selections etc answers in the first array console.log,
// then send questions from `document.querySelector(".newimages")` to chat gpt
// with prompt:
// in my next messages i will send one or more pictures, can you please write the questions on the pictures in a json in the following structure ?[{"question": "a question","options": {"a": "opitoona","b": "optionb","c": "optionc",},"answer": ["a", "b"]}]



all_questions = [];

div = document.createElement("div");
div.classList.add("newimages");
document.body.appendChild(div);

document.querySelectorAll("#watupro_quiz .show-question")
    .forEach(x => {
        the_question = {}


        question = x.querySelector(".show-question-content").textContent;
        // console.log(question)
        the_question.question = question;

        the_question.options = {};
        the_question.answer = [];

        a_i = 0;
        answers = x.querySelector(".show-question-choices");
        answers.querySelectorAll("li.answer")
            .forEach(a => {
                the_question.options[a_i] = a.textContent;
                // console.log(a.textContent)
                if (a.classList.contains("correct-answer")) {
                    // console.log("correct")
                    the_question.answer.push(a_i)
                }

                a_i += 1;
            })
        if (the_question.answer.length != 0) {
            all_questions.push(the_question)
        } else {
            // console.log()
            img = document.createElement("img");
            img.src = `${x.querySelector("img").src}`;
            // console.log(img)
            document.querySelector(".newimages").appendChild(img);
        }
    })

console.log(all_questions)
// console.log(document.querySelector(".newimages"))