import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import AuthHeader from '@components/auth/AuthHeader';
import CustomInput from '@components/auth/CustomInput';
import CustomButton from '@components/auth/CustomButton';
import Colors from '@utils/constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {loginUser, confirmPhoneNumber, resendCode} from 'store/user';
import {RootState, AppDispatch} from 'store';
import {useDispatch, useSelector} from 'react-redux';
import ErrorText from '@components/ErrorText';
import LoadingButton from '@components/LoadingButton';

interface User {
  [key: string]: any;
}

type Props = {
  onBackPress: () => void;
  inputBgColor: string;
  textColor: string;
  bgColor: string;
  user: User | null;
  phoneNumber: string;
  ogPassword: string;
};

const EnterCodeScreen: React.FC<Props> = ({
  onBackPress,
  bgColor,
  textColor,
  inputBgColor,
  user,
  phoneNumber,
  ogPassword,
}) => {
  const [code, setCode] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [showSent, setShowSent] = useState<boolean>(false);

  useEffect(() => {
    if (code && code.length === 6) {
      onSubmit();
    }
  }, [code]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        confirmPhoneNumber({
          id: user?._id,
          phoneNumber,
          otpCode: code,
        }),
      );
      if ('error' in res) {
        setError(true);
        setErrorText((res.payload as {message: string}).message);
        setTimeout(() => {
          setError(false);
        }, 4000);
        console.log(
          `Error on Screen`,
          (res.payload as {message: string}).message,
        );
      }
      console.log(res, 'res');
      if (res?.payload.message === 'Phone number verified.') {
        // move to the next step in your flow
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        console.log(res?.payload.message, 'res');
        const action = await dispatch(
          loginUser({
            email: user?.email.toLowerCase(),
            password: ogPassword,
          }),
        );
        if ('error' in action) {
          setError(true);
          setErrorText((action.payload as {message: string}).message);
          setTimeout(() => {
            setError(false);
          }, 4000);
          console.log(
            `Error on Screen`,
            (action.payload as {message: string}).message,
          );
        }

        console.log(action, 'frontend action');
      } else {
        setError(true);
        setErrorText((res.payload as {message: string}).message);
        setTimeout(() => {
          setError(false);
        }, 4000);
        console.log('Code verification failed.');
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [code, user, phoneNumber]);

  const onResend = async () => {
    const action = await dispatch(resendCode(phoneNumber));
    if ('error' in action) {
      setError(true);
      setErrorText((action.payload as {message: string}).message);
      setTimeout(() => {
        setError(false);
      }, 4000);
      console.log(
        `Error on Screen`,
        (action.payload as {message: string}).message,
      );
    } else {
      setShowSent(true);
      setTimeout(() => {
        setShowSent(false);
      }, 15000);
    }
  };

  return (
    <View style={[styles.wrapper, {backgroundColor: bgColor}]}>
      <AntDesign
        size={20}
        name={'arrowleft'}
        color={textColor}
        onPress={onBackPress}
      />

      <View style={styles.container}>
        <AuthHeader
          textColor={textColor}
          bgColor="transparent"
          text="Enter code"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: -25,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontWeight: '500',
              textAlign: 'center',
              marginBottom: 20,
              marginRight: 10,
            }}>
            Input the code that was recently sent to you.
          </Text>
        </View>

        <CustomInput
          textColor={textColor}
          bgColor={Colors.darkInputBg}
          placeholderTextColor={textColor}
          placeholder="Enter 6-digit code"
          value={code}
          onChange={txt => setCode(txt)}
          keyboardType="numeric"
          maxLength={6}
        />
        {error && <ErrorText text={errorText} />}

        <View style={{marginTop: 15}}>
          {showSent ? (
            <View>
              <Text style={{color: 'white', textAlign: 'center'}}>
                Code sent.
              </Text>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={onResend}
                style={{
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default EnterCodeScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },

  wrapper: {
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  phoneInput: {
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 2,
    padding: 16,
  },

  countryPickerButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  submitButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
