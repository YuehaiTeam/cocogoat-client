import fly from './index'
export async function sendWrongOCRFeedback(feedbackData: any) {
    const { data } = await fly.post('/v1/feedback/ocr', feedbackData)
    return data.id
}
