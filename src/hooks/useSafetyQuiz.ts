import { useState, useEffect, useRef } from "react";
import type { SafetyQuestion, SafetyResult, User } from "../types";

const PENALTY_SECONDS = 10;

interface UseSafetyQuizProps {
    questions: SafetyQuestion[];
    user: User;
    topicId: string;
    onFinish: (result: SafetyResult) => void;
}

export function useSafetyQuiz({questions,user,topicId,onFinish,}:
     UseSafetyQuizProps) {
   
    const [currentIndex,    setCurrentIndex]    = useState(0);
    const [score,           setScore]           = useState(0);
    // const [timeLeft,        setTimeLeft]        = useState(TOTAL_TIME);
    const [elapsed,        setElapsed]        = useState(0);
    const [selectedOption,  setSelectedOption]  = useState<number | null>(null);
    const [wrongFlash,      setWrongFlash]      = useState(false);

    // const startTimeRef = useRef(Date.now());
    const penaltyRef   = useRef(0);
    const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
    const scoreRef = useRef(0);
    const finishedRef  = useRef(false);

    const currentQuestion = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;
    const totalQuestions  = questions.length;

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setElapsed(prev =>  prev + 1);
        },1000);
            return () => clearInterval(timerRef.current!);
    }, []);

    function handleAnswer(index: number) {
        if (selectedOption !== null) return;

        setSelectedOption(index);
        const isCorrect = index === currentQuestion.correct;

        if (isCorrect) {
           scoreRef.current += 1;
            setScore(scoreRef.current);
            goNext(scoreRef.current);
        } else {
            penaltyRef.current += PENALTY_SECONDS;
            setElapsed(prev => prev + PENALTY_SECONDS);
            setWrongFlash(true);

            setTimeout(() => {
                setWrongFlash(false);
                goNext(scoreRef.current);
            }, 800);
        }
    } 

    function goNext(currentScore: number) {
        setSelectedOption(null);
        if (currentIndex === questions.length - 1) { 
        clearInterval(timerRef.current!);
        finish(currentScore);
    } else {
        setCurrentIndex(prev => prev + 1);
    }
    }   
    
    function finish(finalScore: number) {
        if (finishedRef.current) return;
        finishedRef.current = true;

        setElapsed(prev => {
            onFinish({
                name:           user.name,
                avatar:         user.avatar,
                score:          finalScore,
                totalQuestions,
                timeSpent:      prev,          // ← итоговое время с штрафами
                date:           new Date().toLocaleDateString("ru-RU"),
                topic:          topicId,
                correctAnswers: finalScore,
            });
            return prev;
        });
    }

    return {
        currentQuestion,
        currentIndex,
        totalQuestions,
        score,
        elapsed,          
        selectedOption,
        wrongFlash,
        isLast,
        handleAnswer,
    };
}

