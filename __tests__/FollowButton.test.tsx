
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FollowButton from '../src/components/FollowButton'
import { followUser } from '@/action'

jest.mock('../src/action', () => ({
  followUser: jest.fn(),
}))

describe('FollowButton', () => {
  const mockUserId = 'user123'

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders Follow when isFollowed is false', () => {
    render(<FollowButton userId={mockUserId} isFollowed={false} />)
    expect(screen.getByText('Follow')).toBeInTheDocument()
  })

  test('renders Unfollow when isFollowed is true', () => {
    render(<FollowButton userId={mockUserId} isFollowed={true} />)
    expect(screen.getByText('Unfollow')).toBeInTheDocument()
  })

  test('calls followUser and toggles text on click', async () => {
    (followUser as jest.Mock).mockResolvedValueOnce({}) 

    render(<FollowButton userId={mockUserId} isFollowed={false} />)

    const button = screen.getByRole('button', { name: /follow/i })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)

    expect(screen.getByText('Unfollow')).toBeInTheDocument()

    await waitFor(() => {
      expect(followUser).toHaveBeenCalledWith(mockUserId)
    })
  })
})
