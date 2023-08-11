import React from "react";
import { Formik, Field, FieldArray, FormikProps } from "formik";
import {
  DragDropContext,
  Droppable,
  Draggable as DraggableDND,
} from "react-beautiful-dnd";
import { v4 } from "uuid";
import { Card, FormValues, Item } from "./types";

function App() {
  const initialValues: FormValues = localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data")!)
    : {
        data: [
          {
            id: v4(),
            title: "my title",
            card: [
              { title: "cardTitle1", id: v4(), description: "this is des1" },
              { title: "cardTitle2", id: v4(), description: "this is des2" },
            ],
          },
        ],
      };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {
        return;
      }}
    >
      {({ values, setFieldValue }: FormikProps<FormValues>) => {
        localStorage.setItem("data", JSON.stringify(values));
        return (
          <form>
            <FieldArray name="data">
              {({ remove, push }) => (
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
                          className="flex gap-3"
                        >
                          {values?.data?.map((item: Item, index: number) => (
                            <DraggableDND
                              key={item.id}
                              draggableId={`item-${item.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  key={index}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-gray-400 overflow-y-auto overflow-x-hidden p-3 rounded-lg w-[344px] h-max max-h-screen"
                                >
                                  <div className="mb-2">
                                    <Field
                                      name={`data.${index}.title`}
                                      placeholder="Title"
                                      onBlur={(e: any) => {
                                        if (!e.target.value) {
                                          remove(index);
                                        }
                                      }}
                                      autoFocus={item.title ? false : true}
                                      maxLength={30}
                                      className="w-full"
                                    />
                                    {!!item.title && (
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                      >
                                        Remove Item
                                      </button>
                                    )}
                                  </div>
                                  <FieldArray name={`data.${index}.card`}>
                                    {({
                                      remove: removeCard,
                                      push: pushCard,
                                    }) => (
                                      <div className="w-full pb-3">
                                        <DragDropContext
                                          onDragEnd={(result) => {
                                            if (!result.destination) return;
                                            const newOrder = item.card;
                                            const [removed] = newOrder.splice(
                                              result.source.index,
                                              1
                                            );
                                            newOrder.splice(
                                              result.destination.index,
                                              0,
                                              removed
                                            );
                                            const newItem = {
                                              ...item,
                                              card: newOrder,
                                            };
                                            const newData = values.data.map(
                                              (value: Item) => {
                                                if (value.id === item.id) {
                                                  return newItem;
                                                } else {
                                                  return value;
                                                }
                                              }
                                            );

                                            setFieldValue("data", newData);
                                          }}
                                        >
                                          <Droppable
                                            droppableId={`list-card-${item.id}`}
                                            direction="vertical"
                                          >
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="flex flex-wrap gap-3"
                                              >
                                                {item.card.map(
                                                  (
                                                    card: Card,
                                                    cardIndex: number
                                                  ) => (
                                                    <DraggableDND
                                                      key={card.id}
                                                      draggableId={`card-${card.id}`}
                                                      index={cardIndex}
                                                    >
                                                      {(provided) => (
                                                        <div
                                                          key={index}
                                                          ref={
                                                            provided.innerRef
                                                          }
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                          className="bg-white overflow-y-auto overflow-x-hidden p-3 rounded-lg w-80 flex flex-wrap gap-3"
                                                        >
                                                          <Field
                                                            name={`data.${index}.card.${cardIndex}.title`}
                                                            placeholder="Title"
                                                            className="w-full"
                                                            onBlur={(
                                                              e: any
                                                            ) => {
                                                              if (
                                                                !e.target.value
                                                              ) {
                                                                removeCard(
                                                                  cardIndex
                                                                );
                                                              }
                                                            }}
                                                            autoFocus={
                                                              card.title
                                                                ? false
                                                                : true
                                                            }
                                                            maxLength={30}
                                                          />
                                                          <Field
                                                            name={`data.${index}.card.${cardIndex}.description`}
                                                            placeholder="Description"
                                                            className="w-full"
                                                          />

                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              removeCard(
                                                                cardIndex
                                                              )
                                                            }
                                                          >
                                                            Remove Card
                                                          </button>
                                                        </div>
                                                      )}
                                                    </DraggableDND>
                                                  )
                                                )}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </DragDropContext>
                                        {!!item.title && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              pushCard({
                                                title: "",
                                                id: v4(),
                                                description: "",
                                              })
                                            }
                                          >
                                            Add Card
                                          </button>
                                        )}
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
                                id: v4(),
                                title: "",
                                card: [],
                              })
                            }
                            className="h-max bg-blue-300 w-40 rounded-md"
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
