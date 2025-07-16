import { Request, Response } from 'express';

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

describe('createMeeting', () => {
  let createMeetingFunc: typeof import('../controllers/MeetingsController').createMeeting;
  let MeetingsMock: typeof import('../models/Meetings').Meetings;
  let ServicesMock: typeof import('../models/AllServices').Services;

  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeAll(async () => {
    const meetingsController = await import('../controllers/MeetingsController');
    createMeetingFunc = meetingsController.createMeeting;

    MeetingsMock = (await import('../models/Meetings')).Meetings;
    ServicesMock = (await import('../models/AllServices')).Services;
  });

  beforeEach(() => {
    req = {
      role: 'client',
      body: {
        newMeeting: {
          serviceId: 1,
          meetingDate: '2025-07-14T10:00:00.000Z',
          scheduledAt: '2025-07-14T09:00:00.000Z',
          clintId: 1,
          notes: 'Test meeting notes',
          meetingStatus: 'scheduled'
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

  it('should create a new meeting if no overlap', async () => {
    (MeetingsMock.findAll as jest.Mock).mockResolvedValue([]);

    (ServicesMock.findOne as jest.Mock).mockResolvedValue({
      toJSON: () => ({ durationMinutes: 30 }),
    });

    await createMeetingFunc(req as Request, res as Response);

    expect(MeetingsMock.create).toHaveBeenCalledWith({
      ...req.body.newMeeting,
      meetingDate: new Date(req.body.newMeeting.meetingDate),
      scheduledAt: new Date(req.body.newMeeting.scheduledAt),
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("Meeting saved successfully!");
  });

  it('should return 410 if meeting overlaps with existing', async () => {
    const existingMeeting = {
      serviceId: 1,
      meetingDate: new Date('2025-07-14T10:15:00.000Z'),
      get: () => ({
        serviceId: 1,
        meetingDate: new Date('2025-07-14T10:15:00.000Z')
      }),
    };
  
    (MeetingsMock.findAll as jest.Mock).mockResolvedValue([existingMeeting]);
  
    (ServicesMock.findOne as jest.Mock).mockResolvedValue({
      toJSON: () => ({ durationMinutes: 30 }),
    });
  
    await createMeetingFunc(req as Request, res as Response);
  
    expect(res.status).toHaveBeenCalledWith(410);
    expect(res.send).toHaveBeenCalledWith("There is already a meeting scheduled that overlaps this time.");
  });

  it('should return 403 if role is user', async () => {
    req.role = 'user';

    await createMeetingFunc(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith("You are not authorized to perform this action.");
  });

  it('should return 500 if create throws error', async () => {
    (MeetingsMock.findAll as jest.Mock).mockResolvedValue([]);
    (ServicesMock.findOne as jest.Mock).mockResolvedValue({
      toJSON: () => ({ durationMinutes: 30 }),
    });
  
    (MeetingsMock.create as jest.Mock).mockRejectedValue(new Error("DB error"));
  
    await createMeetingFunc(req as Request, res as Response);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining("failed to create meeting"));
  });
});
