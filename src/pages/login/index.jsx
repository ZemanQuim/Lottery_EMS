import { getLogin } from '@/servers/servers';
import { Button, Form, Input, Toast } from '@taroify/core';
import Taro from '@tarojs/taro';
import { Image, View } from '@tarojs/components';
import { inject, observer } from 'mobx-react';
import { Component } from 'react';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  formSubmit = async (event) => {
    let submitdata = event.detail.value;
    try {
      const res = await getLogin(submitdata);
      if (res.code == 200) {
        Taro.setStorageSync('Authorization', res.data.token);
        Toast.success('登录成功');
        Taro.redirectTo({ url: 'pages/transit/index' });
      } else {
        Taro.showToast({ title: res.message || '登录失败', icon: 'none' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <View className='login'>
        <div className='title'>
          <p>中国邮政集团有限公司</p>
          <p>蚌埠市分公司在线抽奖典礼</p>
        </div>
        <div className='login_form'>
          <Image
            className='logo'
            src='https://bengbuyouzheng.oss-cn-shanghai.aliyuncs.com/assets/logo.png'
          />
          <Form labelAlign='center' colon onSubmit={this.formSubmit}>
            <Form.Item
              name='name'
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Form.Label>姓 名</Form.Label>
              <Form.Control>
                <Input placeholder='请输入姓名' />
              </Form.Control>
            </Form.Item>
            <Form.Item
              name='mobile'
              rules={[
                {
                  required: true,
                  pattern:
                    /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                  message: '请输入正确的手机号',
                },
              ]}
            >
              <Form.Label>手机号</Form.Label>
              <Form.Control>
                <Input placeholder='请输入手机号' />
              </Form.Control>
            </Form.Item>
            <View style={{ marginTop: '40px' }}>
              <Button
                style={{
                  backgroundColor: '#A40000',
                  borderColor: '#A40000',
                  color: '#ffffff',
                }}
                shape='round'
                block
                formType='submit'
              >
                登 录
              </Button>
            </View>
          </Form>
        </div>
      </View>
    );
  }
}

export default Index;
