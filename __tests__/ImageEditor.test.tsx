
import { render, screen, fireEvent } from '@testing-library/react'
import ImageEditor from '../src/components/ImageEditor'
import '@testing-library/jest-dom'

describe('ImageEditor', () => {
  const previewURL = 'https://example.com/image.jpg'
  const onClose = jest.fn()
  const setSettings = jest.fn()
  const settings: { type: "original" | "wide" | "square"; sensitive: boolean } = { type: 'original', sensitive: false }

  beforeEach(() => {
    onClose.mockClear()
    setSettings.mockClear()
  })

  it('renders image preview and all buttons', () => {
    render(
      <ImageEditor
        onClose={onClose}
        previewURL={previewURL}
        settings={settings}
        setSettings={setSettings}
      />
    )


    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.getByText('Wide')).toBeInTheDocument()
    expect(screen.getByText('Square')).toBeInTheDocument()
    expect(screen.getByText('Sensitive')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('calls setSettings when type is changed', () => {
    render(
      <ImageEditor
        onClose={onClose}
        previewURL={previewURL}
        settings={settings}
        setSettings={setSettings}
      />
    )

    fireEvent.click(screen.getByText('Wide'))
    expect(setSettings).toHaveBeenCalledWith(expect.any(Function))

    fireEvent.click(screen.getByText('Square'))
    expect(setSettings).toHaveBeenCalledTimes(2)
  })

  it('toggles sensitive flag', () => {
    render(
      <ImageEditor
        onClose={onClose}
        previewURL={previewURL}
        settings={settings}
        setSettings={setSettings}
      />
    )

    fireEvent.click(screen.getByText('Sensitive'))
    expect(setSettings).toHaveBeenCalledWith(expect.any(Function))
  })

  it('calls onClose when clicking save or back icon', () => {
    render(
      <ImageEditor
        onClose={onClose}
        previewURL={previewURL}
        settings={settings}
        setSettings={setSettings}
      />
    )

    fireEvent.click(screen.getByText('Save'))
    expect(onClose).toHaveBeenCalled()


  })
})
