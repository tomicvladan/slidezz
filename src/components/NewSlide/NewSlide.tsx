import {
  Box,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { BiPlus } from "react-icons/bi";
import {
  moveableTargetAtom,
  slidesDeckAtom,
  replaceImageElementAtom,
} from "../../store";
import { templates } from "../../templates";
import { addMoveableToElements } from "../../utils";

export default function NewSlide() {
  const [deck] = useAtom(slidesDeckAtom);
  const [moveableTarget, setMoveableTarget] = useAtom(moveableTargetAtom);
  const [replaceImageElement, setReplaceImageElement] = useAtom(
    replaceImageElementAtom
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addNewSlide = (content: string) => {
    const sectionElement = document.createElement("section");
    sectionElement.innerHTML = content;

    const children = sectionElement.children as any;

    addMoveableToElements(children, setMoveableTarget, setReplaceImageElement);

    const currentSlideIndex = deck.getState().indexh;
    const currentSlide = deck.getCurrentSlide() as HTMLElement;
    const slidesLen = deck.getTotalSlides();
    const slides = deck.getSlidesElement() as HTMLElement;

    //append to the end
    if (currentSlideIndex === slidesLen - 1) {
      slides.appendChild(sectionElement);
    } else {
      slides.insertBefore(sectionElement, currentSlide.nextSibling);
    }

    deck.sync();
    deck.layout();
    deck.next();
    onClose();
  };

  return (
    <Box position="absolute" bottom={4} right={-14}>
      <Tooltip label="Add new slide" hasArrow placement="right">
        <IconButton
          onClick={onOpen}
          rounded="full"
          aria-label="plus"
          icon={<BiPlus />}
        />
      </Tooltip>

      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="600px">
          <ModalHeader>Select a template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid
              overflowY="scroll"
              h="500px"
              columns={{ base: 1, md: 2 }}
              spacing={5}
            >
              {templates.map((template) => {
                return (
                  <Center
                    onClick={() => addNewSlide(template.content)}
                    mx="auto"
                    cursor="pointer"
                    w="300px"
                    h="200px"
                    border="solid 1px #ccc"
                    _hover={{
                      borderColor: "#000",
                    }}
                  >
                    <template.component />
                  </Center>
                );
              })}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
