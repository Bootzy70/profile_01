# student-teaching-portfolio

เว็บไซต์แสดงผลงานนักศึกษาฝึกสอน (กิจกรรม + ตารางเรียน + แผนการสอน) พร้อมสลับภาคเรียน

## Run (Dev)

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

- เปิดใช้ GitHub Pages จาก Settings -> Pages
- แนะนำให้ใช้ GitHub Actions workflow ใน `.github/workflows/deploy.yml`
- เมื่อ push เข้า branch `main` ระบบจะ build แล้ว deploy ให้อัตโนมัติ
