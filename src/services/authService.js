import axiosClient from '@api/axiosClient'

export const login = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase()

  const matchingUsers = await axiosClient.get('/users', {
    params: { email: normalizedEmail },
  })

  const matchedUser = matchingUsers.find((user) => user.password === password)

  if (!matchedUser) {
    throw new Error('Invalid email or password')
  }

  const { password: _password, ...user } = matchedUser

  return { token: matchedUser.token, user }
}
