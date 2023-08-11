import React from "react";
import { Formik, Field, FieldArray } from "formik";
import Draggable from "react-draggable";
import {
  DragDropContext,
  Droppable,
  Draggable as DraggableDND,
} from "react-beautiful-dnd";

function App() {
  const initialValues = localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data")!)
    : {
        data: [
          {
            id: 1,
            title: "my title",
            card: [
              { title: "cardTitle1", id: 2, description: "this is des1" },
              { title: "cardTitle2", id: 3, description: "this is des2" },
            ],
          },
        ],
      };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        return;
      }}
    >
      {({ values, setFieldValue }) => {
        localStorage.setItem("data", JSON.stringify(values));
        return (
          <form>
            <FieldArray name="data">
              {({ remove, push }: any) => (
                <div className="bg-blue-400 h-screen flex flex-row p-4 overflow-x-auto overflow-y-hidden gap-3 ">
                  <DragDropContext
                    onDragEnd={(result) => {
                      if (!result.destination) return;
                      const newData = [...values.data];
                      const [removed] = newData.splice(result.source.index, 1);
                      newData.splice(result.destination.index, 0, removed);
                      setFieldValue("data", newData);
                    }}
                  >
                    <Droppable droppableId="data-list" direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex"
                        >
                          {values.data.map((item: any, index: number) => (
                            <DraggableDND
                              key={item.id}
                              draggableId={`${index}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  key={index}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-gray-400 overflow-y-auto overflow-x-hidden p-3 rounded-lg w-80 "
                                >
                                  <div className="mb-2">
                                    <Field
                                      name={`data.${index}.title`}
                                      placeholder="Title"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      Remove Item
                                    </button>
                                  </div>
                                  <FieldArray name={`data.${index}.card`}>
                                    {({
                                      remove: removeCard,
                                      push: pushCard,
                                    }: any) => (
                                      <div className="h-10 bg-white">
                                        {item.card.map(
                                          (card: any, cardIndex: number) => (
                                            <Draggable axis="y" handle="div">
                                              <div
                                                key={cardIndex}
                                                className="flex flex-wrap"
                                              >
                                                <Field
                                                  name={`data.${index}.card.${cardIndex}.title`}
                                                  className="w-full"
                                                />
                                                <Field
                                                  name={`data.${index}.card.${cardIndex}.description`}
                                                  className="w-full"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    removeCard(cardIndex)
                                                  }
                                                >
                                                  Remove Card
                                                </button>
                                              </div>
                                            </Draggable>
                                          )
                                        )}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            pushCard({
                                              title: "",
                                              id: Date.now(),
                                              description: "",
                                            })
                                          }
                                        >
                                          Add Card
                                        </button>
                                      </div>
                                    )}
                                  </FieldArray>
                                </div>
                              )}
                            </DraggableDND>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                id: Date.now(),
                                title: "",
                                card: [],
                              })
                            }
                          >
                            Add Item
                          </button>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </FieldArray>
          </form>
        );
      }}
    </Formik>
  );
}

export default App;
