import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const buildUserResponse = (user) => ({
  _id: user._id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

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

    const token = createToken(user);

    res.status(200).json({
      message: "로그인이 완료되었습니다.",
      token,
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
