import { GoogleGenerativeAI } from "@google/generative-ai";
import { View } from "app/design/view";
import { Text, TextLink } from "app/design/typography";
import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {},
    };
};

export default function ReadingScreen() {
    const [passage, setPassage] = useState<string>("");
    const [missingWords, setMissingWords] = useState<string[]>([]);
    const [userInputs, setUserInputs] = useState<string[]>([]);
    const [response, setResponse] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const genAI = new GoogleGenerativeAI("AIzaSyA9LA03RXl-StAKbt7_gT4zD0yHExzuMN4");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const getPassageAndMissingWords = async () => {
        try {
            setIsLoading(true);
            const result = await model.generateContent("Tạo một đoạn văn ngắn IELTS Reading với ít nhất 15 từ bị thiếu. Đánh dấu các từ bị thiếu bằng [___]. Cung cấp một danh sách riêng các từ bị thiếu. Đoạn văn nên dài khoảng 250 từ.");
            const response = await result.response;
            const text = response.text();
            const parts = text.split("Danh sách các từ bị thiếu:");
            
            if (parts.length === 2) {
                const [passageWithBlanks, wordList] = parts;
                if (passageWithBlanks && wordList) {
                    setPassage(passageWithBlanks.trim());
                    const words = wordList.trim().split(", ");
                    setMissingWords(words);
                    setUserInputs(new Array(words.length).fill(""));
                } else {
                    throw new Error("Định dạng đoạn văn không hợp lệ");
                }
            } else {
                throw new Error("Định dạng phản hồi không hợp lệ");
            }
        } catch (error) {
            console.error("Không thể tạo đoạn văn và danh sách các từ bị thiếu:", error);
            setError("Đã xảy ra lỗi khi tạo bài tập. Vui lòng thử lại.");
            if (error instanceof Error) {
                console.error("Chi tiết lỗi:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPassageAndMissingWords();
    }, []);

    const handleInputChange = (text: string, index: number) => {
        const newInputs = [...userInputs];
        newInputs[index] = text;
        setUserInputs(newInputs);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const filledPassage = passage.replace(/\[___\]/g, (match, index) => {
                const userInput = userInputs[index];
                return userInput ? userInput : '___';
            });
            const result = await model.generateContent(`Đánh giá câu trả lời sau cho bài tập điền từ IELTS Reading:\n\nĐoạn văn gốc: "${passage}"\n\nĐoạn văn đã điền: "${filledPassage}"\n\nCác từ đúng: ${missingWords.join(", ")}\n\nVui lòng đánh giá theo tiêu chí band 8.0, chỉ ra điểm mạnh, điểm yếu và cách cải thiện.`);
            const response = await result.response;
            setResponse(response.text());
            setError("");
        } catch (error) {
            console.error("Lỗi trong quá trình đánh giá:", error);
            setError("Đã xảy ra lỗi trong quá trình đánh giá. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        setPassage("");
        setMissingWords([]);
        setUserInputs([]);
        setResponse("");
        setError("");
        getPassageAndMissingWords();
    };

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="flex flex-col items-center w-full">
                <View className="w-full p-4 bg-gray-200 rounded-t">
                    <Text className="text-xl text-center font-bold">Bài tập IELTS Reading - Điền từ vào chỗ trống</Text>
                </View>
                <View className="w-full p-6 bg-white shadow-lg rounded-lg mt-3">
                    <Text className="text-xl font-bold mb-4 text-blue-900">Đoạn văn:</Text>
                    {passage && (
                        <Text className="text-base mb-6 p-4 bg-blue-50 rounded-xl shadow-md leading-relaxed">
                            {passage.split(/(\[___\])/).map((part, index) => 
                                part === "[___]" ? (
                                    <input
                                        type="text"
                                        key={index}
                                        style={{
                                            borderBottomWidth: '0.5px',
                                            borderBottomStyle: 'solid',
                                            borderBottomColor: 'grey',
                                            minWidth: '60px',
                                            fontSize: '14px',
                                            padding: '2px',
                                            marginLeft: '2px',
                                            marginRight: '2px',
                                            color: 'blue',
                                            fontWeight: 'bold',
                                            outlineWidth: 0,
                                            outlineColor: 'transparent',
                                            outlineStyle: 'none'
                                        }}
                                        onChange={(e) => handleInputChange(e.target.value, Math.floor(index/2))}
                                        value={userInputs[Math.floor(index/2)]}
                                    />
                                ) : (
                                    <Text key={index}>{part}</Text>
                                )
                            )}
                        </Text>
                    )}
                </View>
                <View className="flex flex-row justify-between w-full mt-3">
                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text className="mt-2 text-blue-500">Đang xử lý...</Text>
                        </View>
                    ) : (
                        <>
                            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded flex-1 mr-2 text-sm">
                                Gửi câu trả lời
                            </button>
                            <button onClick={handleRefresh} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded flex-1 ml-2 text-sm">
                                Làm mới câu hỏi
                            </button>
                        </>
                    )}
                </View>
                {response && (
                    <View className="w-full p-6 bg-white mt-6 shadow-lg rounded-lg">
                        <Text className="text-xl font-bold mb-4 text-blue-900">Đánh giá và Giải thích của AI:</Text>
                        <Text className="text-base text-gray-800 leading-relaxed">
                            {response.split('##').map((part, partIndex) => (
                                <React.Fragment key={partIndex}>
                                    {partIndex > 0 && <Text className="font-bold text-xl mt-3">##</Text>}
                                    {part.split('**').map((subPart, subIndex) => (
                                        <Text key={subIndex} style={subIndex % 2 === 1 ? { fontWeight: 'bold', color: 'blue' } : {}}>
                                            {subPart}
                                        </Text>
                                    ))}
                                </React.Fragment>
                            ))}
                        </Text>
                    </View>
                )}
                {error && (
                    <View className="w-full p-6 bg-red-100 mt-6 shadow-lg rounded-lg">
                        <Text className="text-base text-red-800 font-semibold">{error}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
