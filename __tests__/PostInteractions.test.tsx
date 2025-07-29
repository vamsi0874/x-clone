import { render, screen, fireEvent, act } from '@testing-library/react'
import PostInteractions from '../src/components/PostInteractions'
import { useUser } from '@clerk/nextjs'
import { likePost, rePost, savePost } from '@/action'

jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}))

jest.mock('../src/action', () => ({
  likePost: jest.fn(),
  rePost: jest.fn(),
  savePost: jest.fn(),
}))

jest.mock('../src/socket', () => ({
  socket: {
    emit: jest.fn(),
  },
}))

describe('PostInteractions', () => {
  const mockUser = { username: 'testuser' }

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser })
    jest.clearAllMocks()
  })

  const defaultProps = {
    username: 'otheruser',
    postId: 1,
    count: { likes: 5, rePosts: 2, comments: 3 },
    isLiked: false,
    isRePosted: false,
    isSaved: false,
  }

  it('renders comment, repost, like, and save buttons', () => {
    render(<PostInteractions {...defaultProps} />)

    expect(screen.getByText('3')).toBeInTheDocument() 
    expect(screen.getByText('2')).toBeInTheDocument() 
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls likePost and updates UI optimistically', async () => {
    render(<PostInteractions {...defaultProps} />)
    const likeButton = screen.getByRole('button', { name: '5' })

  await act(async () => {
    fireEvent.click(likeButton);
  });
    expect(screen.getByText('6')).toBeInTheDocument() 
    expect(likePost).toHaveBeenCalledWith(1)
  })


})
