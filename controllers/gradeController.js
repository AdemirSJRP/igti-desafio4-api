import { db } from "../models/index.js";
import { logger } from "../config/logger.js";

const Grade = db.grade;

const create = async (req, res) => {
  try {
    logger.info(`POST /grade - ${JSON.stringify()}`);
    const grade = new Grade(req.body);
    const resp = await grade.save();
    res.send(resp);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Algum erro ocorreu ao salvar" });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  try {
    logger.info(`GET /grade`);
    const name = req.query.name;
    //condicao para o filtro no findAll
    var condition = name
      ? { name: { $regex: new RegExp(name), $options: "i" } }
      : {};
    const grades = await Grade.find(condition);
    if (grades.length <= 0) {
      res.status(404).send("Nenhuma grade encontrada");
    } else {
      res.send(grades);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Erro ao listar todos os documentos" });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  try {
    logger.info(`GET /grade - ${id}`);
    const id = req.params.id;
    const grade = await Grade.findById(id);
    if (!grade) {
      res.status(404).send(`Grade de Id ${id} não encontrada`);
    } else {
      res.send(grade);
    }
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar o Grade id: " + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Dados para atualizacao vazio",
    });
  }

  const id = req.params.id;

  try {
    const grade = await Grade.findbyIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!grade) {
      res.status(404).send(`Grade de Id ${id} não encontrada para atualizar`);
    } else {
      res.send(grade);
    }
    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar a Grade id: " + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const grade = await Grade.findByIdAndRemove(id);
    if (!grade) {
      res.status(404).send(`Grade de Id ${id} não encontrada para exclusão`);
    } else {
      res.send(grade);
    }
    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Nao foi possivel deletar o Grade id: " + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    const grades = await Grade.deleteMany();
    res.send({
      message: `${grades.length} grades excluidas`,
    });
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: "Erro ao excluir todos as Grades" });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
