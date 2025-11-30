import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "24h"; // 개발 환경에서는 24시간으로 연장
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const buildUserResponse = (user) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildAccessToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const parseDurationToMs = (duration) => {
  if (typeof duration === "number") return duration;
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) {
    // fallback 1 day
    return 24 * 60 * 60 * 1000;
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return value;
  }
};

const refreshTokenMaxAgeMs = parseDurationToMs(REFRESH_TOKEN_EXPIRES_IN);

const createAndStoreRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + refreshTokenMaxAgeMs);

  await RefreshToken.create({
    tokenHash,
    user: userId,
    expiresAt,
  });

  return { refreshToken, expiresAt };
};

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: refreshTokenMaxAgeMs,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

// 회원가입
export const register = async (req, res) => {
  try {
    const { email, password, passwordConfirm, name, phone } = req.body;

    // 필수 정보 검증
    if (!email || !password || !passwordConfirm || !name) {
      return res.status(400).json({
        error: "필수 정보를 입력해주세요.",
        details: {
          email: !email ? "이메일은 필수입니다." : null,
          password: !password ? "비밀번호는 필수입니다." : null,
          passwordConfirm: !passwordConfirm
            ? "비밀번호 확인은 필수입니다."
            : null,
          name: !name ? "이름은 필수입니다." : null,
        },
      });
    }

    // 비밀번호 일치 확인
    if (password !== passwordConfirm) {
      return res.status(400).json({
        error: "비밀번호가 일치하지 않습니다.",
      });
    }

    // 비밀번호 유효성 검증 (8자 이상)
    if (password.length < 8) {
      return res.status(400).json({
        error: "비밀번호는 8자 이상이어야 합니다.",
      });
    }

    // 이메일 중복 확인
    const existingUser = await User.findActiveByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "이미 사용 중인 이메일입니다.",
      });
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 사용자 생성
    const user = new User({
      email,
      passwordHash,
      name,
      phone: phone || "",
    });

    await user.save();

    // 비밀번호 해시는 응답에서 제외
    const userResponse = buildUserResponse(user);

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      user: userResponse,
    });
  } catch (error) {
    // MongoDB 중복 키 에러 처리
    if (error.code === 11000) {
      return res.status(409).json({
        error: "이미 사용 중인 이메일입니다.",
      });
    }

    // 유효성 검증 에러 처리
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "입력 정보가 유효하지 않습니다.",
        details: errors,
      });
    }

    console.error("회원가입 오류:", error);
    res.status(500).json({
      error: "회원가입 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 로그인
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "이메일과 비밀번호를 모두 입력해주세요.",
      });
    }

    const user = await User.findActiveByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ error: "이메일 또는 비밀번호가 일치하지 않습니다." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "이메일 또는 비밀번호가 일치하지 않습니다." });
    }

    const accessToken = buildAccessToken(user);

    // 기존 refresh token 제거 후 재발급
    await RefreshToken.deleteMany({ user: user._id });
    const { refreshToken } = await createAndStoreRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      message: "로그인이 완료되었습니다.",
      token: accessToken,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({
      error: "로그인 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// Access Token 재발급
export const refreshAccessToken = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;

    if (!tokenFromCookie) {
      return res.status(401).json({ error: "Refresh Token이 필요합니다." });
    }

    const tokenHash = hashToken(tokenFromCookie);
    const storedToken = await RefreshToken.findOne({ tokenHash }).populate(
      "user"
    );

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await storedToken.deleteOne();
      }
      clearRefreshCookie(res);
      return res
        .status(401)
        .json({ error: "Refresh Token이 유효하지 않습니다." });
    }

    const user = storedToken.user;
    if (!user || user.isDeleted) {
      await storedToken.deleteOne();
      clearRefreshCookie(res);
      return res.status(401).json({ error: "사용자 정보를 찾을 수 없습니다." });
    }

    // 토큰 회전
    await storedToken.deleteOne();
    const accessToken = buildAccessToken(user);
    const { refreshToken } = await createAndStoreRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      message: "토큰이 재발급되었습니다.",
      token: accessToken,
    });
  } catch (error) {
    console.error("토큰 재발급 오류:", error);
    clearRefreshCookie(res);
    res.status(500).json({
      error: "토큰 재발급 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 현재 사용자 정보 조회
export const getMe = async (req, res) => {
  try {
    // req.user는 authenticate 미들웨어에서 설정됨
    const user = req.user;
    const userResponse = buildUserResponse(user);

    res.status(200).json({
      user: userResponse,
    });
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    res.status(500).json({
      error: "사용자 정보 조회 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 사용자 프로필 업데이트
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = req.user; // authenticate 미들웨어에서 설정됨

    // 이름은 필수
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        error: "이름은 필수입니다.",
      });
    }

    // 업데이트할 필드만 설정
    if (name !== undefined) {
      user.name = name.trim();
    }
    if (phone !== undefined) {
      user.phone = phone.trim() || "";
    }

    await user.save();

    const userResponse = buildUserResponse(user);

    res.status(200).json({
      message: "회원 정보가 수정되었습니다.",
      user: userResponse,
    });
  } catch (error) {
    console.error("회원 정보 수정 오류:", error);

    // 유효성 검증 에러 처리
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "입력 정보가 유효하지 않습니다.",
        details: errors,
      });
    }

    res.status(500).json({
      error: "회원 정보 수정 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 배송지 목록 조회
export const getAddresses = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error("배송지 목록 조회 오류:", error);
    res.status(500).json({
      error: "배송지 목록 조회 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 배송지 추가
export const addAddress = async (req, res) => {
  try {
    const {
      recipientName,
      phone,
      zipCode,
      address1,
      address2,
      memo,
      isDefault,
    } = req.body;
    const user = req.user;

    // 필수 필드 검증
    if (!recipientName || !recipientName.trim()) {
      return res.status(400).json({
        error: "수령인은 필수입니다.",
      });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({
        error: "연락처는 필수입니다.",
      });
    }
    if (!zipCode || !zipCode.trim() || !address1 || !address1.trim()) {
      return res.status(400).json({
        error: "주소는 필수입니다.",
      });
    }

    // 기본 배송지로 설정하는 경우, 다른 배송지들의 isDefault를 false로 변경
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // 새 배송지 추가
    const newAddress = {
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      zipCode: zipCode.trim(),
      address1: address1.trim(),
      address2: (address2 || "").trim(),
      memo: (memo || "").trim(),
      isDefault: isDefault || false,
    };

    user.addresses.push(newAddress);
    await user.save();

    // 새로 추가된 배송지 반환 (MongoDB가 생성한 _id 포함)
    const addedAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      message: "배송지가 추가되었습니다.",
      address: addedAddress,
    });
  } catch (error) {
    console.error("배송지 추가 오류:", error);

    // 유효성 검증 에러 처리
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "입력 정보가 유효하지 않습니다.",
        details: errors,
      });
    }

    res.status(500).json({
      error: "배송지 추가 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 배송지 수정
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      recipientName,
      phone,
      zipCode,
      address1,
      address2,
      memo,
      isDefault,
    } = req.body;
    const user = req.user;

    // 배송지 찾기
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        error: "배송지를 찾을 수 없습니다.",
      });
    }

    // 필수 필드 검증
    if (recipientName !== undefined && !recipientName.trim()) {
      return res.status(400).json({
        error: "수령인은 필수입니다.",
      });
    }
    if (phone !== undefined && !phone.trim()) {
      return res.status(400).json({
        error: "연락처는 필수입니다.",
      });
    }
    if (
      (zipCode !== undefined && !zipCode.trim()) ||
      (address1 !== undefined && !address1.trim())
    ) {
      return res.status(400).json({
        error: "주소는 필수입니다.",
      });
    }

    // 기본 배송지로 설정하는 경우, 다른 배송지들의 isDefault를 false로 변경
    if (isDefault && !address.isDefault) {
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    // 배송지 정보 업데이트
    if (recipientName !== undefined) {
      address.recipientName = recipientName.trim();
    }
    if (phone !== undefined) {
      address.phone = phone.trim();
    }
    if (zipCode !== undefined) {
      address.zipCode = zipCode.trim();
    }
    if (address1 !== undefined) {
      address.address1 = address1.trim();
    }
    if (address2 !== undefined) {
      address.address2 = address2.trim();
    }
    if (memo !== undefined) {
      address.memo = memo.trim();
    }
    if (isDefault !== undefined) {
      address.isDefault = isDefault;
    }

    await user.save();

    res.status(200).json({
      message: "배송지가 수정되었습니다.",
      address: address,
    });
  } catch (error) {
    console.error("배송지 수정 오류:", error);

    // 유효성 검증 에러 처리
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "입력 정보가 유효하지 않습니다.",
        details: errors,
      });
    }

    res.status(500).json({
      error: "배송지 수정 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};

// 배송지 삭제
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = req.user;

    // 배송지 찾기
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        error: "배송지를 찾을 수 없습니다.",
      });
    }

    // 배송지 삭제
    user.addresses.pull(addressId);
    await user.save();

    res.status(200).json({
      message: "배송지가 삭제되었습니다.",
    });
  } catch (error) {
    console.error("배송지 삭제 오류:", error);
    res.status(500).json({
      error: "배송지 삭제 중 오류가 발생했습니다.",
      message: error.message,
    });
  }
};
