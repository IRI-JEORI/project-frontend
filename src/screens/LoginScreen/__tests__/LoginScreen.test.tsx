import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import Button from '../../../components/Button';
import LoginScreen from '../index';
import { nunnunApi } from '../../../api';
import { registerDeviceAfterLogin } from '../../../notifications/messaging';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../../api', () => ({
  ApiError: class ApiError extends Error {},
  nunnunApi: {
    auth: {
      getDemoAccounts: jest.fn(),
      demoLogin: jest.fn(),
    },
  },
}));

jest.mock('../../../notifications/messaging', () => ({
  registerDeviceAfterLogin: jest.fn(),
}));

jest.mock('../../../components/Logo', () => 'Logo');
jest.mock('../../../components/TextField', () => 'TextField');

const accounts = [
  { id: 7, nickname: '눈눈', avatar_url: null },
  { id: 8, nickname: '지우', avatar_url: null },
  { id: 9, nickname: '민수', avatar_url: null },
];

describe('LoginScreen demo account selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(nunnunApi.auth.getDemoAccounts).mockResolvedValue({ accounts });
    jest.mocked(nunnunApi.auth.demoLogin).mockResolvedValue({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      user: accounts[0],
    });
    jest.mocked(registerDeviceAfterLogin).mockResolvedValue(undefined);
  });

  it.each([
    ['first', 7],
    ['second', 8],
    ['third', 9],
  ])('logs in with the %s selected backend account id', async (_, accountId) => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<LoginScreen />);
    });

    await ReactTestRenderer.act(async () => {
      renderer.root
        .findByProps({ accessibilityLabel: `demo-account-${accountId}` })
        .props.onPress();
    });
    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType(Button).props.onPress();
    });

    expect(nunnunApi.auth.demoLogin).toHaveBeenCalledTimes(1);
    expect(nunnunApi.auth.demoLogin).toHaveBeenCalledWith(accountId);
    expect(registerDeviceAfterLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('does not submit before an account is selected', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<LoginScreen />);
    });

    expect(renderer.root.findByType(Button).props.onPress).toBeUndefined();
    expect(nunnunApi.auth.demoLogin).not.toHaveBeenCalled();
  });
});
