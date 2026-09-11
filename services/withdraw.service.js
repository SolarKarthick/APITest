const WithdrawModel = require('../models/withdraw.model');

const createWithdraw = async (payload) => {
  const email = payload.email?.trim();
  if (!email) throw Object.assign(new Error('email is required'), { statusCode: 400 });

  const withdrawAmount = Number(payload.withdrawAmount);
  if (!withdrawAmount || withdrawAmount <= 0) {
    throw Object.assign(new Error('withdrawAmount is required and must be greater than 0'), { statusCode: 400 });
  }

  const walletAddress = payload.walletAddress?.trim();
  if (!walletAddress) {
    throw Object.assign(new Error('walletAddress is required'), { statusCode: 400 });
  }

  const coin = payload.coin?.trim();
  if (!coin) {
    throw Object.assign(new Error('coin is required'), { statusCode: 400 });
  }

  const network = payload.network?.trim();
  if (!network) {
    throw Object.assign(new Error('network is required'), { statusCode: 400 });
  }

  const ok = await WithdrawModel.userExistsByEmail(email);
  if (!ok) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return WithdrawModel.create({
    email,
    withdrawAmount,
    walletAddress,
    coin,
    network,
    wallet: payload.wallet?.trim()
  });
};

const getWithdrawsByUser = async (email) => {
  return WithdrawModel.findByUserEmail(email);
};

module.exports = { createWithdraw, getWithdrawsByUser };