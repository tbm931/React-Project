import { Request, Response } from 'express';
import { getMeeting } from '../controllers/MeetingsController';
import * as serviceController from '../controllers/ServicesController';
import { Meetings } from '../models/Meetings';

jest.mock('../models/Meetings', () => ({
  Meetings: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }
}));

jest.mock('../models/AllServices', () => ({
  Services: {
    findOne: jest.fn(),
  }
}));

jest.mock('../controllers/ServicesController', () => ({
  getServicesToServer: jest.fn(),
}));

describe('getMeeting', () => {
  let getMeetingFunc: typeof getMeeting;
  let MeetingsMock: typeof Meetings;

  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockReq = {
    params: { meetingId: '1' },
  } as unknown as Request;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  beforeAll(async () => {
    // מייבא את הקוד בצורה אסינכרונית (שבו יש await בtop-level)
    const controllerModule = await import('../controllers/MeetingsController');
    getMeetingFunc = controllerModule.getMeeting;

    MeetingsMock = (await import('../models/Meetings')).Meetings;
    jest.mock('../models/Meetings');  // אם רוצים להמשיך להשתמש בmock
  });

  beforeEach(() => {
    req = {
      role: 'user', // או כל ערך שמורשה
      body: {
        newMeeting: {
          serviceId: 1,
          meetingDate: '2025-07-14T10:00:00.000Z',
          scheduledAt: '2025-07-13T09:00:00.000Z'
        }
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 403 if services is null', async () => {
    jest.spyOn(serviceController, 'getServicesToServer').mockResolvedValue(null);

    await getMeetingFunc(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith("You are not authorized to perform this action.");
  });

  it('should return meeting if found', async () => {
    jest.spyOn(serviceController, 'getServicesToServer').mockResolvedValue([{
      id: 1,
      serviceName: '',
      serviceDescription: '',
      durationMinutes: 0,
      price: 0,
      isActive: false,
      businessId: 0
    }]);

    (MeetingsMock.findOne as jest.Mock).mockResolvedValue({
      toJSON: () => ({ id: 1, title: 'Test meeting' }),
    });

    await getMeetingFunc(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ id: 1, title: 'Test meeting' });
  });

  it('should return 500 if meeting not found', async () => {
    jest.spyOn(serviceController, 'getServicesToServer').mockResolvedValue([{
      id: 1,
      serviceName: '',
      serviceDescription: '',
      durationMinutes: 0,
      price: 0,
      isActive: false,
      businessId: 0
    }]);
    (MeetingsMock.findOne as jest.Mock).mockResolvedValue(null);

    await getMeetingFunc(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith("failed to get meeting.");
  });

  it('should handle unexpected errors', async () => {
    jest.spyOn(serviceController, 'getServicesToServer').mockResolvedValue([{
      id: 1,
      serviceName: '',
      serviceDescription: '',
      durationMinutes: 0,
      price: 0,
      isActive: false,
      businessId: 0
    }]);
    (MeetingsMock.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

    await getMeetingFunc(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith(expect.stringContaining("failed to get meeting."));
  });
});