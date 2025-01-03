"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css"; 

export default function Home() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState("");
    const [quizComplete, setQuizComplete] = useState(false);


    useEffect(() => {
        axios
            .get("https://opentdb.com/api.php", {
                params: { amount: 5, type: "multiple" },
            })
            .then((resp) => {
                const fetchedQuestions = resp.data.results.map((q) => ({
                    ...q,
                    answers: shuffleAnswers([
                        ...q.incorrect_answers,
                        q.correct_answer,
                    ]),
                }));
                setQuestions(fetchedQuestions);
            })
            .catch((error) => {
                console.log("Error fetching data: ", error);
            });
    }, []);

    
    const shuffleAnswers = (answers) => {
        return answers.sort(() => Math.random() - 0.5);
    };

    
    const handleNextQuestion = () => {
        if (selected === questions[currentQuestion].correct_answer) {
            setScore(score + 1);
        }
        setSelected("");

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setQuizComplete(true);
        }
    };

    
    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelected("");
        }
    };

    
    const handleAnswerState = (e) => {
        setSelected(e.target.value);
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelected("");
        setQuizComplete(false);
    };

    return (
        <div className="container">
            <h3 className="title">Quiz App</h3>

            {quizComplete ? (
                <div className="quiz-complete">
                    <h3>Quiz Complete!</h3>
                    <p>
                        Your final score is: <strong>{score}</strong>/
                        {questions.length}
                    </p>
                    <button className="button" onClick={restartQuiz}>
                        Restart Quiz
                    </button>
                </div>
            ) : questions.length > 0 ? (
                <div className="quiz-container">
                    <h3>{questions[currentQuestion].question}</h3>
                    <div className="answers">
                        {questions[currentQuestion].answers.map((answer, index) => (
                            <div key={index} className="answer-option">
                                <input
                                    type="radio"
                                    name="answer"
                                    value={answer}
                                    checked={selected === answer}
                                    onChange={handleAnswerState}
                                />
                                <label>{answer}</label>
                            </div>
                        ))}
                    </div>
                    <p className="score">Score: {score}</p>
                </div>
            ) : (
                <p className="loading">Loading questions...</p>
            )}

            <div className="buttons">
                <button
                    className="button"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                >
                    Previous Question
                </button>
                <button
                    className="button"
                    onClick={handleNextQuestion}
                    disabled={!selected}
                >
                    {currentQuestion === questions.length - 1
                        ? "Finish Quiz"
                        : "Next Question"}
                </button>
            </div>
        </div>
    );
}
