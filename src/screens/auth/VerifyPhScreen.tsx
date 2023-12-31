import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AuthHeader from '@components/auth/AuthHeader';
import CustomInput from '@components/auth/CustomInput';
import CustomButton from '@components/auth/CustomButton';
import Colors from '@utils/constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CountryPicker} from 'react-native-country-codes-picker';
import {sendCode, fetchUserByValue} from 'store/user';
import {RootState, AppDispatch} from 'store';
import {useDispatch, useSelector} from 'react-redux';
import ErrorText from '@components/ErrorText';
import LoadingButton from '@components/LoadingButton';

interface User {
  [key: string]: any;
}

type Props = {
  onBackPress: () => void;
  onVerify: (phoneNumber: string) => void;
  onNext: () => void;
  inputBgColor: string;
  textColor: string;
  bgColor: string;
  user: User | null;
};

const VerifyPhScreen: React.FC<Props> = ({
  onBackPress,
  onNext,
  bgColor,
  textColor,
  inputBgColor,
  user,
  onVerify,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const dispatch = useDispatch<AppDispatch>();
  const userId: string = user?._id?.toString() || '';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const onContinuePress = async () => {
    try {
      // Dispatch the confirmUser action with the necessary payload
      setIsLoading(true);
      const res = await dispatch(sendCode(`${countryCode}${phoneNumber}`));
      console.log(res, 'response');
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      onVerify(`${countryCode}${phoneNumber}`);
      onNext();
    } catch (error) {
      console.log(error);
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
          text="Verify phone number"
        />
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={{marginRight: 5, width: 'auto'}}>
              <View style={{pointerEvents: 'none'}}>
                <CustomInput
                  textColor={textColor}
                  bgColor={Colors.darkInputBg}
                  placeholderTextColor={textColor}
                  placeholder=""
                  value={countryCode}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
            <View style={{width: '80%'}}>
              <CustomInput
                textColor={textColor}
                bgColor={Colors.darkInputBg}
                placeholderTextColor={textColor}
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={txt => setPhoneNumber(txt)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <CountryPicker
            show={show}
            lang="en"
            // when picker button press you will get the country object with dial code
            pickerButtonOnPress={item => {
              setCountryCode(item.dial_code);
              setShow(false);
            }}
            style={{
              modal: {
                height: '80%',
                backgroundColor: 'white',
              },
            }}
          />
        </View>
        <View style={{marginTop: 15}}>
          {isLoading ? (
            <LoadingButton />
          ) : (
            <CustomButton
              onPress={onContinuePress}
              textColor={textColor}
              bgColor={Colors.navy2}
              value="Send code"
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default VerifyPhScreen;

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
