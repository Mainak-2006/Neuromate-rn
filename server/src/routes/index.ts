import { Router } from 'express';
import documentsRouter from './documents';
import lessonsRouter from './lessons';
import quizzesRouter from './quizzes';
import quizAttemptsRouter from './quizAttempts';
import flashcardsRouter from './flashcards';
import reviewsRouter from './reviews';
import progressRouter from './progress';
import profilesRouter from './profiles';

export const apiRouter = Router();

apiRouter.use('/documents', documentsRouter);
apiRouter.use('/lessons', lessonsRouter);
apiRouter.use('/quizzes', quizzesRouter);
apiRouter.use('/quiz-attempts', quizAttemptsRouter);
apiRouter.use('/flashcards', flashcardsRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/progress', progressRouter);
apiRouter.use('/profiles', profilesRouter);

export default apiRouter;
