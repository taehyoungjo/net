import React from "react";
import { useDrag, useDrop } from "react-dnd";
import ItemTypes from "../ItemTypes";
const style = {
  padding: "0 1rem",
  backgroundColor: "white",
  cursor: "move",
};
const Item = ({
  id,
  card,
  text,
  moveItem,
  unshiftItem,
  findItem,
  removeItem,
}) => {
  const originalIndex = findItem(id).index;
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.ITEM, id, originalIndex, card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      // console.log(monitor);
      const { id: droppedId, originalIndex, card: cardId } = monitor.getItem();
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        console.log("DID NOT DROP");
        // This happens if drop is not successful
        // And item needs to be returned
        // In this case fromCard === toCard
        moveItem(droppedId, originalIndex);
      }
    },
  });
  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    canDrop: () => false,
    hover({ id: draggedId, card: cardId, text }) {
      // console.log("HOVERING");

      if (draggedId !== id) {
        const { index: overIndex } = findItem(id);
        console.log(
          "draggedId: ",
          draggedId,
          "overIndex: ",
          overIndex,
          "cardId: ",
          cardId
        );

        // Check to see if card is different
        if (cardId == card) {
          moveItem(draggedId, overIndex);
        } else {
          // removeItem()
          // Remove item with id X from card Y
          console.log("REMOVE AND ADD");
          unshiftItem({ id: draggedId, text: text });
        }
      }
    },
  });
  const opacity = isDragging ? 0 : 1;

  // Add a delete button in this div somewhere that toggles
  return (
    <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
      <button onClick={() => removeItem(id)}>Delete</button>
      <div style={{ border: "1px solid gray", padding: "0.5rem 1rem" }}>
        {text}
        {/* <button onClick={() => removeItem(id)}>Delete</button> */}
      </div>
    </div>
  );
};
export default Item;
