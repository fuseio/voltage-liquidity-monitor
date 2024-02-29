import express from 'express';
import { checkBalance, registerListeners } from './helpers/listeners';
import dotenv from 'dotenv';
import { Scheduler } from './scheduler';
dotenv.config();
const app = express();

const scheduleTasks = () => {
  const liquidityScheduler = new Scheduler(60 * 60 * 1000);
  const liquidityTask = () => {
    try {
      checkBalance()
    } catch (e) {
      console.log(e);
    }
  }
  liquidityScheduler.addTask(liquidityTask);
  liquidityScheduler.start()
}

app.listen(4000, () => {
  scheduleTasks()
  registerListeners()
  console.log(`server running on port 4000`);
});