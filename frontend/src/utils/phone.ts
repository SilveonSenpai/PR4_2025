export const normalizePhone = (value: string) => {
  // залишаємо + і цифри
  let cleaned = value.replace(/[^\d+]/g, "");

  // якщо почали вводити з 0 — автоматично підставляємо +38
  if (cleaned.startsWith("0")) {
    cleaned = "+38" + cleaned;
  }

  // якщо без +, але 12 цифр (380...)
  if (/^380\d{9}$/.test(cleaned)) {
    cleaned = "+" + cleaned;
  }

  return cleaned;
};

export const isValidUAPhone = (value: string) => {
  return /^\+380\d{9}$/.test(value);
};

export const formatPhoneDisplay = (value: string) => {
  const digits = value.replace(/\D/g, "");

  let result = "+380";

  if (digits.length > 3) {
    result += " " + digits.substring(3, 5);
  }
  if (digits.length > 5) {
    result += " " + digits.substring(5, 8);
  }
  if (digits.length > 8) {
    result += " " + digits.substring(8, 10);
  }
  if (digits.length > 10) {
    result += " " + digits.substring(10, 12);
  }

  return result;
};

