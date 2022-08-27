import { Box, Image, useColorModeValue, Textarea } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { LogoPositions } from "../../config/logo-positions";

//@ts-ignore
import Reveal from "reveal.js";
//@ts-ignore
import Markdown from "reveal.js/plugin/markdown/markdown";
//@ts-ignore
import RevealHighlight from "reveal.js/plugin/highlight/highlight";

import {
  slideShowSettingsAtom,
  styleSettingsAtom,
  slidesLogoAtom,
  moveableTargetAtom,
  editModeAtom,
  replaceImageElementAtom,
} from "../../store";
import Moveable from "react-moveable";
import MoveableHelper from "moveable-helper";
import fscreen from "fscreen";
import SlideSideBar from "../SlideSideBar/SlideSideBar";
import EditMode from "./EditMode";
import { addMoveableToElements, isHTML } from "../../utils";
import { ReplaceImage } from "./ReplaceImage";
import {
  MoveableDeleteButton,
  MoveableDeleteButtonProps,
} from "./Moveable/Ables/MoveableDeleteButton";
import {
  MoveableDimension,
  MoveableDimensionProps,
} from "./Moveable/Ables/MoveableDimension";
import { Slides } from "../../types";

interface SlideShowProps {
  deckName: string;
  deck: any;
  setDeck: (deck: any) => void;
  slides: Slides;
}

export default function SlideShow({
  deckName,
  deck,
  setDeck,
  slides,
}: SlideShowProps) {
  const moveableRef = useRef() as RefObject<Moveable>;
  const [replaceImageElement, setReplaceImageElement] = useAtom(
    replaceImageElementAtom
  );
  const [slideShowSettings] = useAtom(slideShowSettingsAtom);
  const [styleSettings] = useAtom(styleSettingsAtom);
  const [slidesLogo] = useAtom(slidesLogoAtom);
  const [editMode] = useAtom(editModeAtom);
  const [moveableTarget, setMoveableTarget] = useAtom(moveableTargetAtom);
  const [moveableHelper] = useState(() => {
    return new MoveableHelper();
  });
  const [elementGuidelines, setElementGuidelines] = useState<HTMLElement[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slidesRef = useRef() as RefObject<HTMLDivElement>;

  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      if (!moveableRef.current?.isInside(e.clientX, e.clientY)) {
        setMoveableTarget(undefined);
      }
    };

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [moveableRef]);

  useEffect(() => {
    if (slidesRef.current && isHTML(slides.data))
      slidesRef.current.innerHTML = slides.data;
  }, [slidesRef]);

  useEffect(() => {
    document.body.setAttribute("data-theme", styleSettings.theme);
  }, [styleSettings]);

  useEffect(() => {
    //@ts-ignore
    const newDeck = Reveal(document.querySelector(`.${deckName}`), {
      embedded: true,
      keyboardCondition: "focused",
      plugins: [Markdown, RevealHighlight],
      ...slideShowSettings,
    });
    newDeck.initialize().then(() => {
      setDeck(newDeck);
      newDeck.layout();
      newDeck.sync();

      newDeck.getSlides().forEach((slide: any) => {
        addMoveableToElements(
          slide.children,
          setMoveableTarget,
          setReplaceImageElement
        );
      });

      setElementGuidelines([
        newDeck.getRevealElement(),
        newDeck.getSlidesElement(),
        newDeck.getViewportElement(),
      ]);

      newDeck.on("slidechanged", () => {
        setMoveableTarget(undefined);
      });

      newDeck.on("overviewshown", () => {
        setMoveableTarget(undefined);
      });
    });

    const handleFullScreenChange = () => {
      setIsFullscreen(fscreen.fullscreenElement !== null);
    };

    fscreen.addEventListener("fullscreenchange", handleFullScreenChange);

    const handleResize = () => {
      setMoveableTarget(undefined);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      newDeck.destroy();
      fscreen.removeEventListener("fullscreenchange", handleFullScreenChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (deck) {
      deck.layout();
      deck.sync();
    }
  }, [deck]);

  useEffect(() => {
    if (deck) deck.configure(slideShowSettings);
  }, [slideShowSettings]);

  return (
    <Box
      className="slideshow"
      position="relative"
      borderWidth="1px"
      borderColor={useColorModeValue("latte-overlay0", "frappe-overlay0")}
      borderBottom="none"
      w="full"
      h="full"
    >
      <SlideSideBar />
      <EditMode />
      {replaceImageElement && !isFullscreen && <ReplaceImage />}

      <Box className={`reveal ${deckName}`}>
        <Box ref={slidesRef} className="slides">
          {!isHTML(slides.data) && (
            <section data-markdown="" data-separator="---">
              <Textarea data-template defaultValue={slides.data} />
            </section>
          )}
          {moveableTarget && !isFullscreen ? (
            <Moveable<MoveableDeleteButtonProps & MoveableDimensionProps>
              ables={[MoveableDeleteButton, MoveableDimension]}
              deleteButton={true}
              dimension={true}
              ref={moveableRef}
              bounds={{
                left: 0,
                top: 0,
                right: document.querySelector(".slides")?.clientWidth,
                bottom: document.querySelector(".slides")?.clientHeight,
              }}
              elementGuidelines={elementGuidelines}
              target={moveableTarget}
              setTarget={setMoveableTarget}
              draggable={editMode === "MOVE" ? true : false}
              throttleDrag={0}
              startDragRotate={0}
              throttleDragRotate={0}
              zoom={1}
              origin={true}
              padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
              resizable={editMode === "MOVE" ? true : false}
              keepRatio={false}
              throttleScale={0}
              renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
              edge={false}
              snappable={editMode === "MOVE" ? true : false}
              verticalGuidelines={[0, 200, 400]}
              horizontalGuidelines={[0, 200, 400]}
              snapThreshold={5}
              isDisplaySnapDigit={true}
              snapGap={true}
              snapDirections={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                center: true,
                middle: true,
              }}
              elementSnapDirections={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                center: true,
                middle: true,
              }}
              snapDigit={0}
              onResizeStart={moveableHelper.onResizeStart}
              onResize={moveableHelper.onResize}
              onDragStart={moveableHelper.onDragStart}
              onDrag={moveableHelper.onDrag}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (editMode === "TEXT") {
                  target.focus();
                }
              }}
            />
          ) : null}
        </Box>
        {slidesLogo && (
          <Image
            position="absolute"
            {...LogoPositions[slideShowSettings.slidesLogoPosition]}
            h={{ base: "10px", sm: "20px", md: "30px", lg: "50px" }}
            w={{ base: "10px", sm: "20px", md: "30px", lg: "50px" }}
            objectFit="cover"
            src={URL.createObjectURL(new Blob([slidesLogo.data.buffer]))}
          />
        )}
      </Box>
    </Box>
  );
}
