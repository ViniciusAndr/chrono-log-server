import express, { Express } from "express";
import cors from "cors";
import { db } from "./prisma/index";
import bodyParser from "body-parser";
import { format } from "date-fns";

const port = process.env.PORT || 3333;
const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", async (req: any, res) => {
  const { date } = req.query;
  const activityList = await db.activity.findMany({
    where: {
      date: {
        equals: date,
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
  res.json(activityList);
});

app.post("/activity/new", async (req, res) => {
  try {
    await db.activity.create({
      data: req.body,
    });
  } finally {
    res.sendStatus(200);
  }
});

app.put("/activity/finish/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.activity.update({
      where: { id },
      data: { endTime: format(new Date(), "HH:mm") },
    });
  } finally {
    res.sendStatus(200);
  }
});

app.listen(port, () => {});
