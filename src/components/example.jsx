import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import Card from "./Card";
import update from "immutability-helper";
import ItemTypes from "../ItemTypes";
const style = {
  // width: 400,
  // display: "flex",
  padding: "25vh 15vh 0",
  overflow: "hidden",
  width: "2700px",
  height: "98vh",
};
const addstyle = {
  float: "left",
  width: "300px",
  // height: "100%",
  // border: "1px dashed gray",
  padding: "0 1rem",
  // marginBottom: ".5rem",
  backgroundColor: "white",
};

const Container = () => {
  var init;
  init = localStorage.getItem("test");
  const [cards, setCards] = useState(init ? JSON.parse(init) : []);

  useEffect(() => {
    localStorage.setItem("test", JSON.stringify(cards));
    // console.log(localStorage.getItem("test"));
  });

  var r = init
    ? Array.prototype.concat
        .apply(
          [],
          JSON.parse(init).map((e) => e.links)
        )
        .map((d) => d.id)
        .sort()
    : [];

  // We can have a top level array store the ids for individual items
  const [itemIds, setItemIds] = useState(r);
  const findNextItemId = () => {
    var fst;
    var i = 1;
    var sorted = itemIds.sort();
    console.log(sorted);
    if (sorted.length != 0) {
      while (true) {
        if (sorted[i - 1] != i) {
          fst = i;
          break;
        }
        i++;
      }
    } else {
      fst = 1;
    }
    console.log("before update: ", itemIds, fst);
    setItemIds(
      update(itemIds, {
        $unshift: [fst],
      })
    );
    return fst;
  };

  const removeItemId = (id) => {
    var i = itemIds.indexOf(Number(id));
    console.log(id);
    console.log("pre", itemIds, i);
    setItemIds(
      update(itemIds, {
        $splice: [[i, 1]],
      })
    );
  };

  // All of these need to update the itemIds array
  const removeCard = (id) => {
    const { card, index } = findCard(id);
    setCards(
      update(cards, {
        $splice: [[index, 1]],
      })
    );
  };

  const moveCard = (id, atIndex) => {
    const { card, index } = findCard(id);
    setCards(
      update(cards, {
        $splice: [
          [index, 1],
          [atIndex, 0, card],
        ],
      })
    );
    console.log(cards);
  };

  // returns the card and index of that card with id 'id'
  const findCard = (id) => {
    const card = cards.filter((c) => `${c.id}` === id)[0];
    return {
      card,
      index: cards.indexOf(card),
    };
  };
  const [, drop] = useDrop({ accept: ItemTypes.CARD });

  // move item
  // we call this when
  // * drag starts but no drop and reset is needed (we know fromCard === toCard)
  // * successful move calling from useDrop (in this case we know toCard)
  // const moveItem = (id, atIndex, fromCard, toCard) => {
  //   if (fromCard === toCard) {
  //     // do what we would do in moveItem normally
  //     const { item, cardIndex, itemIndex } = findItem(id);
  //     // FIX THIS
  //     setCards(
  //         update(cards, {
  //         $splice: [
  //             [index, 1],
  //             [atIndex, 0, item],
  //         ],
  //         })
  //     );
  //   } else {
  //     // remove from fromCard
  //     const { item, cardIndex, itemIndex } = findItem(id);
  //     // FIX THIS
  //     setItems(
  //         update(items, {
  //         $splice: [[index, 1]],
  //         })
  //     );
  //     // update item's card
  //     // add to toCard in atIndex
  // }
  // }

  const findItemAux = (id) => {
    for (var i = 0; i < cards.length; i++) {
      console.log(cards[i].links);
      for (var j = 0; j < cards[i].links.length; j++) {
        console.log(j);
        if (cards[i].links[j] === id) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  };

  // return the item, cardIndex, and itemIndex
  //  of the item with id 'id'
  const findItem = (id) => {
    // Search each list for item with id 'id'
    var [i, j] = findItemAux(id);
    var item = i != -1 ? cards[i][j] : null;
    console.log("item: ", item, "index: ", j, "cardIndex: ", i);
    return {
      item,
      index: j,
      cardIndex: i,
    };
  };

  return (
    <>
      <div ref={drop} style={style}>
        <div
          style={addstyle}
          onClick={() => {
            // setCards(cards.unshift({ id: 4, text: "testing" }));
            var ids = cards.map((card) => card.id).sort();

            var fst;
            var i = 1;
            if (ids.length != 0) {
              while (true) {
                if (ids[i - 1] != i) {
                  fst = i;
                  break;
                }
                i++;
              }
            } else {
              fst = 1;
            }

            setCards([
              {
                id: fst,
                text: "test" + fst,
                links: [],
              },
              ...cards,
            ]);
          }}
        >
          {" "}
          <div
            style={{
              border: "1px solid gray",
              padding: "0.5rem 1rem",
              textAlign: "center",
            }}
          >
            +
          </div>
        </div>
        {cards.map((card) => (
          <Card
            key={card.id}
            id={`${card.id}`}
            text={card.text}
            links={card.links}
            moveCard={moveCard}
            findCard={findCard}
            findItem={findItem}
            removeCard={removeCard}
            findNextItemId={findNextItemId}
            removeItemId={removeItemId}
          />
        ))}
      </div>
    </>
  );
};
export default Container;
