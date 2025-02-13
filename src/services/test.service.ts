class TestService {
  async getTest() {
    return {
      message: 'SignIn successfully',
      status: 200,
    };
  }
}

export default new TestService();
