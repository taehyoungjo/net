import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import ItemTypes from "../ItemTypes";
import Item from "./Item";

const style = {
  float: "left",
  width: "300px",
  // height: "600px",
  // border: "1px dashed gray",
  padding: "0 1rem",
  // marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};
const addstyle = {
  border: "1px dashed gray",
  padding: "0 1rem",
  backgroundColor: "white",
};
const Card = ({
  id,
  text,
  links,
  moveCard,
  findCard,
  findItem,
  removeCard,
  findNextItemId,
  removeItemId,
}) => {
  useEffect(() => {
    let strg = JSON.parse(localStorage.getItem("test"));
    let index = strg.map((e) => e.id + "").indexOf(id + "");
    strg[index] = {
      id: id,
      text: text,
      links: items,
    };
    localStorage.setItem("test", JSON.stringify(strg));
  });

  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, originalIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      const { id: droppedId, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        moveCard(droppedId, originalIndex);
      }
    },
  });
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => false,
    hover({ id: draggedId }) {
      if (draggedId !== id) {
        const { index: overIndex } = findCard(id);
        console.log(draggedId, overIndex);
        moveCard(draggedId, overIndex);
      }
    },
  });
  const opacity = isDragging ? 0 : 1;

  const [items, setItems] = useState(links);

  const unshiftItem = (item) => {
    setItems(
      update(items, {
        $unshift: [item],
      })
    );
  };

  const removeItem = (id) => {
    const { item, index } = findItem(id);
    setItems(
      update(items, {
        $splice: [[index, 1]],
      })
    );
    removeItemId(id);
  };

  const moveItem = (id, atIndex) => {
    const { item, index } = findItem(id);
    setItems(
      update(items, {
        $splice: [
          [index, 1],
          [atIndex, 0, item],
        ],
      })
    );
    console.log(items);
  };

  //   // returns the card and index of that card with id 'id'
  //   const findItem = (id) => {
  //     const item = items.filter((c) => `${c.id}` === id)[0];
  //     return {
  //       item,
  //       index: items.indexOf(item),
  //     };
  //   };

  const [, drop2] = useDrop({
    accept: ItemTypes.ITEM,
    hover({ id: draggedId, card: cardId, text }) {
      // console.log("CARD HOVERING");
    },
  });

  // Add a delete button in this div somewhere that toggles
  return (
    <div ref={(node) => drop2(drag(drop(node)))} style={{ ...style, opacity }}>
      <div style={{ border: "1px solid gray", padding: "0.5rem 1rem" }}>
        {text}
        <button onClick={() => removeCard(id)}>Delete</button>
        <div
          style={addstyle}
          onClick={() => {
            let i = findNextItemId();
            unshiftItem({ id: i, text: i + "" });
          }}
        >
          +
        </div>
        {
          (console.log("test", items),
          items.map((card) => (
            <Item
              key={card.id}
              id={`${card.id}`}
              card={id}
              text={card.text}
              moveItem={moveItem}
              findItem={findItem}
              unshiftItem={unshiftItem}
              removeItem={removeItem}
            />
          )))
        }
      </div>
    </div>
  );
};
export default Card;
