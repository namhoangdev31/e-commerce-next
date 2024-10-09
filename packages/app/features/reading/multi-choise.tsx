import { GoogleGenerativeAI } from '@google/generative-ai'
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'

export default function MultiChoiceReadingScreen() {
  const [passage, setPassage] = useState<string>('')
  const [questions, setQuestions] = useState<
    Array<{ question: string; options: string[] }>
  >([])
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [response, setResponse] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [savedAnswers, setSavedAnswers] = useState<string[]>([])

  const genAI = new GoogleGenerativeAI(
    'AIzaSyA9LA03RXl-StAKbt7_gT4zD0yHExzuMN4',
  )
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const getPassageAndQuestions = async () => {
    try {
      setIsLoading(true)
      const result = await model.generateContent(
        'Tạo một đoạn văn ngắn IELTS Reading band 8.0 khoảng 100 từ và 4 câu hỏi trắc nghiệm về đoạn văn đó. Mỗi câu hỏi có 4 lựa chọn. Hãy định dạng kết quả như sau: [PASSAGE] Nội dung đoạn văn [/PASSAGE] [QUESTIONS] 1. Câu hỏi 1? A. Lựa chọn A B. Lựa chọn B C. Lựa chọn C D. Lựa chọn D 2. Câu hỏi 2? A. ... [/QUESTIONS]',
      )
      const response = await result.response
      const text = response.text()

      const passageMatch = text.match(/\[PASSAGE\]([\s\S]*?)\[\/PASSAGE\]/)
      const questionsMatch = text.match(
        /\[QUESTIONS\]([\s\S]*?)\[\/QUESTIONS\]/,
      )
      if (passageMatch && questionsMatch) {
        const passageText = passageMatch[1]?.trim() ?? ''
        const questionsText = questionsMatch[1]?.trim() ?? ''

        setPassage(passageText)
        const questionsList = questionsText
          .split(/\d+\./)
          .filter((q) => q.trim() !== '')
        const formattedQuestions = questionsList.map((q) => {
          const [question, ...options] = q
            .split(/[A-D]\./)
            .map((item) => item.trim())
          return { question: question || '', options }
        })

        setQuestions(formattedQuestions)
        setUserAnswers(new Array(formattedQuestions.length).fill(''))
        setSavedAnswers(new Array(formattedQuestions.length).fill(''))
      } else {
        throw new Error('Định dạng phản hồi không hợp lệ')
      }
    } catch (error) {
      console.error('Không thể tạo đoạn văn và câu hỏi:', error)
      setError('Đã xảy ra lỗi khi tạo bài tập. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPassageAndQuestions()
  }, [])

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answer
    console.log(newAnswers)
    setUserAnswers(newAnswers)
    setSavedAnswers(newAnswers)
  }

  const handleSaveAnswers = () => {
    setSavedAnswers([...userAnswers])
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const answersString = savedAnswers
        .map((answer, index) => `Câu ${index + 1}: ${answer}`)
        .join('\n')
      const questionsString = questions
        .map((q, index) => {
          const optionsString = q.options
            .map(
              (option, optIndex) =>
                `   (${String.fromCharCode(65 + optIndex)}) ${option}`,
            )
            .join('\n')
          return `Câu ${index + 1}: ${q.question}\n${optionsString}`
        })
        .join('\n\n')

      const result =
        await model.generateContent(`Đánh giá câu trả lời sau cho bài đọc IELTS:
Đoạn văn: ${passage}
Câu hỏi:
${questionsString}
Câu trả lời:
${answersString}
Vui lòng chỉ ra đáp án đúng, giải thích đủ và chi tiết của câu hỏi và đáp án đúng, bỏ qua kết luận.`)
      const response = await result.response
      setResponse(response.text())
    } catch (error) {
      console.error('Lỗi khi đánh giá câu trả lời:', error)
      setError('Đã xảy ra lỗi khi đánh giá câu trả lời. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setPassage('')
    setQuestions([])
    setUserAnswers([])
    setSavedAnswers([])
    setResponse('')
    setError('')
    getPassageAndQuestions()
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="flex w-full flex-col items-center">
        <View className="w-full rounded-t bg-gray-200 p-4">
          <Text className="text-center text-xl font-bold">
            Bài tập IELTS Reading - Trắc nghiệm
          </Text>
        </View>
        <View className="mt-3 w-full rounded-lg bg-white p-6 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-blue-900">
            Đoạn văn:
          </Text>
          <Text className="mb-6 rounded-xl bg-blue-50 p-4 text-base leading-relaxed shadow-md">
            {passage}
          </Text>
        </View>
        <View className="mt-3 w-full rounded-lg bg-white p-6 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-blue-900">Câu hỏi:</Text>
          {questions.map((q, qIndex) => (
            <View key={qIndex} className="mb-6">
              <Text className="mb-2 text-lg font-semibold">
                {qIndex + 1}. {q.question}
              </Text>
              {q.options.map((option, oIndex) => (
                <View key={oIndex} className="mb-2 flex-row items-center">
                  <input
                    type="checkbox"
                    value={String.fromCharCode(65 + oIndex)}
                    checked={
                      userAnswers[qIndex] === String.fromCharCode(65 + oIndex)
                    }
                    onChange={() =>
                      handleAnswerSelect(
                        qIndex,
                        String.fromCharCode(65 + oIndex),
                      )
                    }
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <Text className="ml-2">
                    {String.fromCharCode(65 + oIndex)}. {option}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        {savedAnswers.length > 0 && (
          <View className="mt-3 w-full rounded-lg bg-white p-6 shadow-lg">
            <Text className="mb-4 text-xl font-bold text-blue-900">
              Đáp án đã lưu:
            </Text>
            {savedAnswers.map((answer, index) => (
              <View key={index} className="mb-2 flex-row">
                <Text className="font-semibold">Câu {index + 1}: </Text>
                <Text>{answer}</Text>
              </View>
            ))}
          </View>
        )}
        <View className="mt-3 flex w-full flex-row justify-between">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="mt-2 text-blue-500">Đang xử lý...</Text>
            </View>
          ) : (
            <>
              <button
                onClick={handleSaveAnswers}
                className="mr-2 flex-1 rounded bg-yellow-500 px-3 py-1 text-sm font-bold text-white hover:bg-yellow-700"
              >
                Lưu đáp án
              </button>
              <button
                onClick={handleSubmit}
                className="mr-2 flex-1 rounded bg-blue-500 px-3 py-1 text-sm font-bold text-white hover:bg-blue-700"
              >
                Gửi câu trả lời
              </button>
              <button
                onClick={handleRefresh}
                className="ml-2 flex-1 rounded bg-green-500 px-3 py-1 text-sm font-bold text-white hover:bg-green-700"
              >
                Làm mới câu hỏi
              </button>
            </>
          )}
        </View>
        {response && (
          <View className="mt-6 w-full rounded-lg bg-white p-6 shadow-lg">
            <Text className="mb-4 text-xl font-bold text-blue-900">
              Đánh giá và Giải thích của AI:
            </Text>
            <Text className="text-base leading-relaxed text-gray-800">
              {response.split('##').map((part, partIndex) => (
                <React.Fragment key={partIndex}>
                  {partIndex > 0 && (
                    <Text className="mt-3 text-xl font-bold">##</Text>
                  )}
                  {part.split('**').map((subPart, subIndex) => (
                    <Text
                      key={subIndex}
                      style={
                        subIndex % 2 === 1
                          ? { fontWeight: 'bold', color: 'blue' }
                          : {}
                      }
                    >
                      {subPart}
                    </Text>
                  ))}
                </React.Fragment>
              ))}
            </Text>
          </View>
        )}
        {error && (
          <View className="mt-6 w-full rounded-lg bg-red-100 p-6 shadow-lg">
            <Text className="text-base font-semibold text-red-800">
              {error}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
