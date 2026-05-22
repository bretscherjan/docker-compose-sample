const express = require("express");
const serverResponses = require("../utils/helpers/responses");
const messages = require("../config/messages");
const { Todo } = require("../models/todos/todo");

const memoryTodos = [];

const routes = (app) => {
  const router = express.Router();

  router.post("/todos", (req, res) => {
    if (process.env.USE_MEMORY_DB === "true") {
      const todo = { text: req.body.text };
      memoryTodos.push(todo);
      serverResponses.sendSuccess(res, messages.SUCCESSFUL, todo);
      return;
    }

    const todo = new Todo({
      text: req.body.text,
    });

    todo
      .save()
      .then((result) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.get("/", (req, res) => {
    if (process.env.USE_MEMORY_DB === "true") {
      serverResponses.sendSuccess(res, messages.SUCCESSFUL, memoryTodos);
      return;
    }

    Todo.find({}, { __v: 0 })
      .then((todos) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, todos);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
