import { Field, Formik } from 'formik'
import { useAtom } from 'jotai'
import { BsLink } from 'react-icons/bs'

import {
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'

import { moveableTargetsAtom, slidesDeckAtom } from '../../../../store'

interface AddYouTubeEmbedVideoProps {
  addVideoOnClose: () => void
}

interface FormValues {
  url: string
}

const initialValues: FormValues = {
  url: '',
}

function youtubeParser(url: string) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length == 11 ? match[7] : false
}

export default function AddYouTubeEmbedVideo({
  addVideoOnClose,
}: AddYouTubeEmbedVideoProps) {
  const [deck] = useAtom(slidesDeckAtom)
  const [_, setMoveableTargets] = useAtom(moveableTargetsAtom)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const addVideoToCurrentSlide = (values: FormValues) => {
    const currentSlideIndex = deck.getState().indexh
    const slide = deck.getSlides()[currentSlideIndex]

    const videoContainer = document.createElement('div')
    videoContainer.classList.add('container', 'media-container')

    const iframeWrapper = document.createElement('div')
    iframeWrapper.classList.add('iframe-wrapper')

    const iframeElement = document.createElement('iframe')
    iframeElement.src = `https://www.youtube.com/embed/${youtubeParser(
      values.url
    )}`

    videoContainer.addEventListener('click', () => {
      setMoveableTargets([videoContainer])
    })

    iframeWrapper.append(iframeElement)
    videoContainer.append(iframeWrapper)

    slide.appendChild(videoContainer)
    deck.sync()
    deck.layout()

    onClose()
    addVideoOnClose()
    setMoveableTargets([videoContainer])
  }

  return (
    <>
      <Tooltip label="Insert from Youtube" hasArrow>
        <IconButton onClick={onOpen} aria-label="link" icon={<BsLink />} />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Formik
          validateOnMount
          onSubmit={addVideoToCurrentSlide}
          initialValues={initialValues}
        >
          {({ isValid, errors, touched, handleSubmit }) => (
            <ModalContent>
              <ModalHeader>Insert from Youtube</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isInvalid={!!touched.url && !!errors.url}>
                  <Field
                    as={Input}
                    id="url"
                    name="url"
                    placeHolder="https://..."
                    validate={(value: string) => {
                      let error: string | undefined

                      if (!value) {
                        error = 'Required'
                      } else if (youtubeParser(value) === false) {
                        error = 'Invalid Youtube URL'
                      }

                      return error
                    }}
                  />
                  <FormErrorMessage>{errors.url}</FormErrorMessage>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={() => handleSubmit()} isDisabled={!isValid}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Formik>
      </Modal>
    </>
  )
}
