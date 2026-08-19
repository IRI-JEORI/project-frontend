export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Permission: undefined;
  Home: undefined;
  PersonalGroup: undefined;
  InviteCode: undefined;
  WakeGroupDetail: undefined;
  WakeAlarm: { memberName: string; onComplete: (photoUri: string) => void };
  CameraCapture: { memberName: string; onComplete: (photoUri: string) => void };
  PhotoReview: {
    photoUri: string;
    memberName: string;
    onComplete: (photoUri: string) => void;
  };
};
