import apiClient from './client'

export function getTopics() {
  return apiClient.get('/topics')
}

export function getTopic(id) {
  return apiClient.get(`/topics/${id}`)
}

export function createTopic(data) {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('content', data.content)
  if (data.attachments?.length) {
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file)
    })
  }
  return apiClient.post('/topics', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function addMessage(topicId, data) {
  const formData = new FormData()
  formData.append('content', data.content)
  if (data.attachments?.length) {
    data.attachments.forEach((file) => {
      formData.append('attachments[]', file)
    })
  }
  return apiClient.post(`/topics/${topicId}/messages`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function getUnreadCount() {
  return apiClient.get('/topics/unread-count')
}
