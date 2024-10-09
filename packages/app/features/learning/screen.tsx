import { GoogleGenerativeAI } from "@google/generative-ai";
import { View } from "app/design/view";
import { Text, TextLink } from "app/design/typography";
import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { ScrollView, ActivityIndicator, TextInput } from "react-native";

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
    };
};

export default function LearningScreen() {
    const [input, setInput] = useState("");
    const [responses, setResponses] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [question, setQuestion] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const genAI = new GoogleGenerativeAI("AIzaSyA9LA03RXl-StAKbt7_gT4zD0yHExzuMN4");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const getQuestion = async () => {
        setIsLoading(true);
        try {
            const result = await model.generateContent("Generate an IELTS Writing Task question with a common or complex topic, suitable for band 8.0");
            const response = await result.response;
            const text = response.text();
            setQuestion(text);
        } catch (error) {
            console.error("Lỗi khi tạo câu hỏi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getQuestion();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            if (question) {
                const result = await model.generateContent(`Đánh giá và giải thích câu trả lời sau cho câu hỏi IELTS Writing Task: "${question}"\n\nCâu trả lời của thí sinh: ${input}\n\nVui lòng đánh giá theo tiêu chí band 8.0, chỉ ra điểm mạnh, điểm yếu và cách cải thiện.`);
                const response = await result.response;
                const text = response.text();
                setResponses(prevResponses => [...prevResponses, text]);
                setErrors(prevErrors => [...prevErrors, ""]);
            }
        } catch (error) {
            setResponses(prevResponses => [...prevResponses, ""]);
            setErrors(prevErrors => [...prevErrors, error instanceof Error ? error.message : "Đã xảy ra lỗi"]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    const handleRefresh = () => {
        setInput("");
        setResponses([]);
        setErrors([]);
        getQuestion();
    };

    return (
        <View className="flex flex-col items-center w-full h-full">
            <View className="w-full p-4 bg-gray-200 rounded-t">
                <Text className="text-3l text-center font-bold">IELTS Writing Task - Band 8.0</Text>
            </View>
            <View className="w-full h-1/2 overflow-y-auto p-4 bg-white">
                <Text className="text-l font-bold mb-4">Đánh giá và Giải thích của AI:</Text>
                <View className="space-y-4">
                    {responses.map((response, index) => (
                        <View key={index} className="bg-white p-6 rounded-lg shadow-md mb-4 border border-gray-200">
                            <Text className="text-lg text-gray-800 leading-relaxed">
                                {response.split('##').map((part, partIndex) => (
                                    <React.Fragment key={partIndex}>
                                        {partIndex > 0 && <Text className="font-bold">##</Text>}
                                        {part.split('**').map((subPart, subIndex) => (
                                            <Text key={subIndex} style={subIndex % 2 === 1 ? { fontWeight: 'bold' } : {}}>
                                                {subPart}
                                            </Text>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </Text>
                            {errors[index] && (
                                <View className="mt-4 bg-red-100 border-l-4 border-red-500 p-4">
                                    <Text className="text-red-700 font-semibold">Lỗi:</Text>
                                    <Text className="text-red-600 mt-1">{errors[index]}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
            <View className="w-full h-1/2 p-4 bg-gray-100">
                <Text className="text-l font-bold mb-4">Câu hỏi IELTS Writing Task:</Text>
                {question && (
                    <Text className="text-sm font-bold mb-4 p-4 bg-blue-100 rounded-lg shadow-md">
                        {question.split('##').map((part, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <Text className="font-bold">##</Text>}
                                {part.split('**').map((subPart, subIndex) => (
                                    <Text key={subIndex} style={subIndex % 2 === 1 ? { fontWeight: 'bold' } : {}}>
                                        {subPart}
                                    </Text>
                                ))}
                            </React.Fragment>
                        ))}
                    </Text>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full h-full">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Nhập câu trả lời của bạn ở đây..."
                        className="flex-1 p-4 border rounded"
                        disabled={isLoading}
                        style={{ minHeight: 500, maxHeight: 1000, width: '100%'}}
                    />
                    <View className="flex flex-row justify-between w-full mt-3">
                        {isLoading ? (
                            <View className="flex-1 items-center justify-center">
                                <ActivityIndicator size="large" color="#0000ff" />
                                <Text className="mt-2 text-blue-500">Đang xử lý...</Text>
                            </View>
                        ) : (
                            <>
                                <button 
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded flex-1 mr-2 text-sm"
                                >
                                    Gửi câu trả lời
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleRefresh}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded flex-1 ml-2 text-sm"
                                >
                                    Làm mới câu hỏi
                                </button>
                            </>
                        )}
                    </View>
                </form>
            </View>
        </View>
    );
}