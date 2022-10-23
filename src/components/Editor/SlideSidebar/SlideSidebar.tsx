import { Box, useColorModeValue } from '@chakra-ui/react'
import AddImage from './AddImage/AddImage'
import AddVideo from './AddVideo/AddVideo'
import { BsFillImageFill } from 'react-icons/bs'
import { addImageToCurrentSlide } from '../../../utils'
import { useAtom } from 'jotai'
import { moveableTargetAtom, slidesDeckAtom } from '../../../store'
import AddText from './AddText'
import { RiText } from 'react-icons/ri'
import NewSlide from './NewSlide'
import SlideSideBarItem from './SlideSidebarItem'
import RemoveSlide from './RemoveSlide'

export default function SlideSidebar() {
  const [deck] = useAtom(slidesDeckAtom)
  const [moveableTarget, setMoveableTarget] = useAtom(moveableTargetAtom)

  return (
    <Box
      bg={useColorModeValue('latte-crust', 'frappe-crust')}
      fontSize={{ base: 'xs', md: 'md' }}
      position="absolute"
      borderRadius="lg"
      overflow="hidden"
      top={0}
      right={{ base: -8, md: -16 }}
    >
      <AddText>
        <SlideSideBarItem icon={RiText} label="Text" />
      </AddText>

      <AddImage
        handleAddImage={async (image) =>
          await addImageToCurrentSlide(image, deck, setMoveableTarget)
        }
      >
        <SlideSideBarItem icon={BsFillImageFill} label="Image" />
      </AddImage>
      <AddVideo />
      <RemoveSlide />
      <NewSlide />
    </Box>
  )
}
