// import httpStatus from 'http-status';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatService } from './Chat.service';


const chatResponse = catchAsync(async (req, res) => {
  const response = await ChatService.getChatResponse(req.body.prompt);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Documents are retrieved successfully',
    data: response,
  });
});

export const ChatControllers = {
  chatResponse
};