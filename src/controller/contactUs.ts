import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import { text } from "stream/consumers";
import IssueUsModel from "../model/issueModel";
import CommentModel from "../model/commentModel";

export default class ContactUsController {
  public static addIssue: RequestHandler = async (req, res) => {
    const data: Prisma.IssueUncheckedCreateInput = {
      authorId: Number(req.body.tokenData.id),
      text: req.body.data.text,
      title: req.body.data.title,
    };
    await IssueUsModel.addIssue(data);

    res.send({ ok: true });
  };

  public static getAllIssues: RequestHandler = async (req, res) => {
    const data = await IssueUsModel.getAllIssues();
    res.send(data);
  };

  public static delIssue: RequestHandler = async (req, res) => {
    const id = Number(req.query.issueId);

    await IssueUsModel.delIssue(id);
    res.send(true);
  };

  public static addComment: RequestHandler = async (req, res) => {
    const data: Prisma.CommentUncheckedCreateInput = {
      authorId: Number(req.body.tokenData.id),
      text: req.body.data.text,
      issueId: req.body.data.issueId,
    };

    const result = await CommentModel.addComment(data);
    res.send(result);
  };
}
