# Öğrenci Danışmanlık Otomasyonu — Ana Proje Planı

> **Belgenin amacı:** Bu dosya, gerçek bir okul ortamında uzun süre kullanılabilecek Öğrenci Danışmanlık Otomasyonu'nun geliştirme sözleşmesi, teknik mimarisi, kalite kuralları ve aşamalı uygulama planıdır. Cursor, Antigravity veya başka bir AI coding assistant ile birlikte kullanılmak üzere hazırlanmıştır.
>
> **Temel ilke:** Proje tek seferde üretilmeyecek. Her faz küçük, doğrulanabilir adımlarla ilerleyecek. Bir fazın build/test/doğrulama koşulları sağlanmadan sonraki faza geçilmeyecek.
>
> **Geliştirme ortamı:** Windows 11, VS Code, Visual Studio, Cursor, Antigravity; Python ve C#/.NET kurulu. İlk hedef tamamen local geliştirmedir. Daha sonra GitHub + Vercel test deployment ve ardından production hazırlığı yapılacaktır.

---

# 1. Proje Özeti ve Hedefi

Amaç; öğrenciler, danışmanlar ve yöneticiler arasında akademik danışmanlık süreçlerini dijitalleştiren, güvenli, test edilebilir, sürdürülebilir ve ileride gerçek okul altyapısında kullanılabilecek bir web uygulaması geliştirmektir.

İlk sürüm:

- tamamen localde geliştirilecek,
- gerçek okul verisi içermeyecek,
- fake/seed development verisi kullanacak,
- GitHub üzerinde sürümlenecek,
- Vercel üzerinde frontend test deployment yapılacak,
- ASP.NET Core backend ayrı erişilebilir bir test ortamına taşınabilecek şekilde tasarlanacak,
- PostgreSQL production'a taşınabilir olacak,
- güvenlik, backup, restore, monitoring ve KVKK gereksinimleri dikkate alınacaktır.

## 1.1 Ana hedefler

Sistem:

- öğrencilerin danışmanıyla iletişim ve randevu süreçlerini yönetmeli,
- danışmanların öğrencilerini ve görüşmelerini yönetmesini sağlamalı,
- yöneticilerin kullanıcıları ve akademik yapıyı yönetmesine izin vermeli,
- randevu çakışmalarını önlemeli,
- yetkisiz veri erişimini backend seviyesinde engellemeli,
- kritik işlemleri audit log ile izleyebilmeli,
- raporlama yapabilmeli,
- responsive ve erişilebilir olmalı,
- Türkçe kullanılabilmeli,
- ileride çoklu dil desteğine hazır olmalı,
- test edilebilir ve deploy edilebilir olmalıdır.

---

# 2. Kesinleşen Teknoloji Kararı

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Playwright

## Backend

- ASP.NET Core Web API
- C#
- .NET 10 LTS
- Entity Framework Core
- ASP.NET Core Identity
- REST API
- OpenAPI / Swagger

## Database

- PostgreSQL

## Architecture

- Modular Monolith
- Clean Architecture prensipleri
- Domain / Application / Infrastructure / API ayrımı
- Modül bazlı organizasyon
- İlk sürümde microservice kullanılmayacak

## Test

- xUnit
- Integration Tests
- API Tests
- Playwright E2E

## Deployment

- Docker
- Docker Compose
- GitHub Actions
- Vercel: Next.js frontend test deployment
- ASP.NET Core API: ayrı erişilebilir hosting ortamı
- PostgreSQL: local Docker, ileride managed PostgreSQL veya sunucu

## İhtiyaç oluştuğunda değerlendirilebilecekler

- Redis
- Hangfire
- Serilog
- OpenTelemetry

Bu araçlar ilk sürümde sırf mimariyi büyütmek için eklenmeyecektir.

---

# 3. Mimari Karar: Modular Monolith

İlk sürümde microservice kullanılmayacaktır.

Sistem tek backend uygulaması içinde modüler olarak geliştirilecektir.

Önerilen modüller:

```text
Identity
Students
Advisors
AdvisorAssignments
Appointments
Meetings
Announcements
Notifications
Academic
Reports
Audit
```

Avantajlar:

- daha az operasyonel karmaşıklık,
- daha kolay local geliştirme,
- daha kolay deployment,
- daha kolay debugging,
- daha düşük maliyet,
- tek kişi/öğrenci geliştirici için daha yönetilebilir yapı,
- ileride ihtiyaç olursa belirli modüllerin ayrıştırılabilmesi.

AI coding assistant gereksiz yere microservice mimarisi önermemelidir.

---

# 4. Kullanıcı Rolleri

İlk sürüm:

```text
SUPER_ADMIN
ADMIN
ADVISOR
STUDENT
```

Gelecekte:

```text
DEPARTMENT_HEAD
SECRETARY
COUNSELOR
```

eklenebilir.

## 4.1 SUPER_ADMIN

- sistemsel ayarlar,
- tüm kullanıcılar,
- roller,
- akademik yapı,
- audit log erişimi,
- kritik yönetim işlemleri.

## 4.2 ADMIN

- kullanıcı yönetimi,
- öğrenci yönetimi,
- danışman yönetimi,
- danışman atamaları,
- akademik yapı,
- duyurular,
- raporlar.

## 4.3 ADVISOR

- kendisine atanmış öğrenciler,
- öğrenci detayları,
- randevu yönetimi,
- görüşme kayıtları,
- danışmanlık notları,
- duyurular,
- bildirimler.

## 4.4 STUDENT

- kendi profili,
- kendi danışmanı,
- randevu oluşturma,
- kendi randevuları,
- görüşme geçmişi,
- duyurular,
- bildirimler.

---

# 5. Temel Modüller

## 5.1 Authentication

- login
- logout
- password hashing
- password reset
- account lockout
- role management
- authentication state
- güvenli session/token yaklaşımı
- güvenlik eventleri
- development kullanıcıları

Okulda Microsoft 365 / Entra ID / Active Directory varsa ileride entegrasyon değerlendirilebilir. İlk sürümde okul SSO'su yoksa ASP.NET Core Identity kullanılacaktır.

---

# 6. User Management

Admin:

- kullanıcı listeleme,
- kullanıcı oluşturma,
- kullanıcı güncelleme,
- kullanıcı pasifleştirme,
- rol atama,
- arama,
- filtreleme,
- pagination,
- sorting.

**Güvenlik:** Frontend'de bir butonu gizlemek authorization değildir. Backend authorization zorunludur.

---

# 7. Student Module

Örnek alanlar:

```text
Id
StudentNumber
FirstName
LastName
Email
Phone
DepartmentId
AcademicYearId
Status
CreatedAt
UpdatedAt
```

Gereksiz hassas veri toplanmayacaktır.

KVKK açısından:

- data minimization,
- least privilege,
- erişim kontrolü,
- saklama süresi,
- silme veya anonymization stratejisi

tasarımın parçasıdır.

---

# 8. Advisor Module

Örnek alanlar:

```text
Id
UserId
FirstName
LastName
Email
DepartmentId
Office
Phone
Status
```

Danışman:

- öğrencilerini,
- müsaitliklerini,
- randevularını,
- görüşmelerini,
- ilgili duyurularını

yönetebilmelidir.

---

# 9. Advisor Assignment

Öğrenci-danışman ilişkisi ayrı bir entity olarak tutulmalıdır.

```text
AdvisorAssignment
-----------------
Id
StudentId
AdvisorId
AcademicYearId
StartDate
EndDate
IsPrimary
Status
CreatedAt
UpdatedAt
```

Kurallar:

- aynı akademik dönemde bir öğrencinin birden fazla primary advisor'ı olamaz,
- geçmiş ilişkiler korunmalıdır,
- aktif/pasif durum izlenmelidir,
- resource authorization assignment üzerinden uygulanabilmelidir.

---

# 10. Appointment Module

Öğrenci danışmandan randevu alabilmelidir.

Örnek alanlar:

```text
Id
StudentId
AdvisorId
StartAt
EndAt
Status
Title
StudentNote
AdvisorNote
CreatedAt
UpdatedAt
CancelledAt
CancellationReason
```

Durumlar:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
NO_SHOW
REJECTED
```

## 10.1 Kritik kural: Concurrency

İki öğrencinin aynı zaman dilimini aynı anda almaya çalışması engellenmelidir.

Frontend kontrolü yeterli değildir.

Backend + database seviyesinde concurrency protection uygulanmalıdır.

Değerlendirilebilecek yöntemler:

- transaction,
- unique constraint/index,
- optimistic concurrency,
- uygun isolation level.

Somut çözüm database modelinin son haline göre seçilecektir.

---

# 11. Advisor Availability

Danışman:

- çalışma günlerini,
- saat aralıklarını,
- istisna günlerini,
- izinleri

tanımlayabilmelidir.

Örnek:

```text
Monday
09:00 - 12:00
13:00 - 16:00
```

Öğrenci yalnızca uygun slotları görebilmelidir.

---

# 12. Meeting Module

Randevu tamamlandıktan sonra görüşme kaydı oluşturulabilir.

```text
Meeting
-------
Id
AppointmentId
AdvisorId
StudentId
MeetingDate
Summary
ActionItems
PrivateNotes
FollowUpDate
CreatedAt
UpdatedAt
```

`PrivateNotes` gibi danışmana özel alanlar ayrıca authorization ile korunmalıdır.

---

# 13. Announcements

Yönetici veya yetkili kullanıcı:

- duyuru oluşturabilir,
- güncelleyebilir,
- yayınlayabilir,
- yayından kaldırabilir,
- hedef kitle belirleyebilir.

Hedefler:

```text
ALL
STUDENTS
ADVISORS
DEPARTMENT
```

İleride belirli kullanıcı hedefleme eklenebilir.

---

# 14. Notifications

İlk sürümde in-app notification yeterlidir.

Örnek eventler:

- yeni randevu,
- randevu onayı,
- randevu reddi,
- randevu iptali,
- yeni duyuru,
- follow-up tarihi.

Gelecekte:

- email,
- push notification,
- SMS

ekleneebilir.

---

# 15. Academic Module

Akademik veri modeli:

```text
AcademicYear
Term
Department
Program
Course
Enrollment
Grade
Attendance
```

İlk sürümde gereksiz karmaşıklık oluşturmadan aşamalı uygulanacaktır.

---

# 16. Reports

İlk raporlar:

- toplam öğrenci sayısı,
- toplam danışman sayısı,
- danışman başına öğrenci sayısı,
- randevu sayıları,
- tamamlanan randevular,
- iptal edilen randevular,
- no-show istatistikleri,
- dönem bazlı danışmanlık istatistikleri.

Tüm raporlar rol ve resource authorization'a tabi olacaktır.

---

# 17. Audit Log

Kritik işlemler audit log ile izlenmelidir.

```text
AuditLog
--------
Id
UserId
Action
EntityType
EntityId
OldValues
NewValues
IpAddress
UserAgent
CreatedAt
```

Örnek işlemler:

- login/logout,
- kullanıcı oluşturma,
- kullanıcı pasifleştirme,
- rol değişikliği,
- danışman atama,
- randevu oluşturma/iptal,
- görüşme oluşturma,
- kritik veri güncellemeleri.

Audit log içine:

- password,
- access token,
- refresh token,
- secret,
- gereksiz hassas PII

yazılmayacaktır.

---

# 18. Database Tasarım İlkeleri

PostgreSQL kullanılacaktır.

Her entity için gerektiğinde:

- primary key,
- foreign key,
- unique constraints,
- indexes,
- nullability,
- timestamps,
- status/soft-delete

tasarlanacaktır.

Database değişiklikleri EF Core migrations ile yönetilecektir.

Örnek:

```powershell
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Migration öncesi uygun build/test kontrolleri yapılacaktır.

---

# 19. API Standardı

Base path:

```text
/api/v1
```

Örnek:

```text
GET    /api/v1/students
GET    /api/v1/students/{id}
POST   /api/v1/students
PUT    /api/v1/students/{id}
DELETE /api/v1/students/{id}
```

Randevu:

```text
GET    /api/v1/appointments
GET    /api/v1/appointments/{id}
POST   /api/v1/appointments
PUT    /api/v1/appointments/{id}
POST   /api/v1/appointments/{id}/cancel
POST   /api/v1/appointments/{id}/confirm
POST   /api/v1/appointments/{id}/complete
```

API özellikleri:

- RESTful,
- versioned,
- documented,
- validated,
- authorization protected,
- pagination,
- filtering,
- sorting.

---

# 20. Standard Error Response

ASP.NET Core `ProblemDetails` yaklaşımı tercih edilmelidir.

Örnek:

```json
{
  "type": "https://example.com/errors/validation",
  "title": "Validation failed",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "instance": "/api/v1/students",
  "errors": {
    "email": [
      "Email is required."
    ]
  }
}
```

Production'da client'a:

- stack trace,
- internal exception detayları,
- secret bilgiler

gönderilmeyecektir.

---

# 21. Pagination / Filtering / Sorting

Liste endpointlerinde pagination kullanılacaktır.

Örnek:

```text
?page=1&pageSize=20&sortBy=lastName&sortDirection=asc&search=ali
```

Maksimum `pageSize` belirlenmelidir.

Örnek response:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalCount": 120,
  "totalPages": 6
}
```

---

# 22. Frontend Architecture

```text
frontend/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── schemas/
├── services/
├── types/
└── tests/
```

Kurallar:

- feature-based organization,
- reusable components,
- merkezi API client yaklaşımı,
- form validation,
- TypeScript strict mode,
- loading/error/empty state,
- responsive UI,
- accessibility.

Frontend hiçbir zaman backend authorization'ın yerine geçmez.

---

# 23. Backend Architecture

```text
backend/
├── StudentAdvisory.sln
├── src/
│   ├── StudentAdvisory.Api/
│   ├── StudentAdvisory.Application/
│   ├── StudentAdvisory.Domain/
│   ├── StudentAdvisory.Infrastructure/
│   └── StudentAdvisory.Modules/
│       ├── Identity/
│       ├── Students/
│       ├── Advisors/
│       ├── AdvisorAssignments/
│       ├── Appointments/
│       ├── Meetings/
│       ├── Announcements/
│       ├── Notifications/
│       ├── Academic/
│       ├── Reports/
│       └── Audit/
└── tests/
    ├── StudentAdvisory.UnitTests/
    ├── StudentAdvisory.IntegrationTests/
    └── StudentAdvisory.ApiTests/
```

İlk sürümde aşırı abstraction oluşturulmayacaktır.

Sırf pattern kullanmak için aşağıdakiler zorunlu değildir:

- Generic Repository,
- Unit of Work abstraction,
- CQRS,
- MediatR,
- Event Sourcing.

Gerçek ihtiyaç oluşursa değerlendirilir.

---

# 24. Repository Yapısı

```text
student-advisory/
├── frontend/
├── backend/
├── tests/
├── docs/
├── docker/
├── .github/
│   └── workflows/
├── .gitignore
├── .env.example
├── README.md
├── PROJECT_PLAN.md
└── CHANGELOG.md
```

---

# 25. Documentation

```text
docs/
├── requirements.md
├── architecture.md
├── database.md
├── api.md
├── authentication.md
├── authorization.md
├── development.md
├── deployment.md
├── backup.md
├── security.md
└── troubleshooting.md
```

Requirements değişirse ilgili dokümantasyon güncellenmelidir.

---

# 26. Environment Variables ve Secret Yönetimi

Source control'a gerçek secret girilmeyecektir.

Local:

```text
.env
.env.local
```

Repository:

```text
.env.example
```

Örnek:

```env
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

DATABASE_URL=

API_BASE_URL=
NEXT_PUBLIC_API_BASE_URL=

AUTH_SECRET=
```

Gerçek değerler `.env` dosyalarında veya ilgili platformların secret/environment variable alanlarında tutulacaktır.

---

# 27. Timezone

Backend/database için mümkün olduğunca UTC kullanılacaktır.

UI gösterim ve kullanıcı etkileşimlerinde:

```text
Europe/Istanbul
```

kullanılacaktır.

Belirsiz local `DateTime` kullanımından kaçınılmalıdır.

---

# 28. UI / UX

Uygulama:

- Türkçe,
- responsive,
- mobil uyumlu,
- tablet uyumlu,
- desktop uyumlu,
- erişilebilir

olmalıdır.

Ana dashboardlar:

```text
Student Dashboard
Advisor Dashboard
Admin Dashboard
```

UI bileşenleri en azından:

- loading state,
- empty state,
- error state,
- success feedback,
- confirmation dialog,
- form validation

içermelidir.

Kritik işlemler confirmation gerektirir.

---

# 29. Accessibility

En azından:

- semantic HTML,
- keyboard navigation,
- visible focus,
- form labels,
- gerektiğinde ARIA,
- yeterli contrast,
- erişilebilir hata mesajları

sağlanacaktır.

---

# 30. Internationalization

İlk sürüm:

```text
tr-TR
```

İleride:

```text
en-US
```

eklenebilecek şekilde tasarlanacaktır.

UI metinleri rastgele component içine hard-code edilmeyecektir.

---

# 31. Authentication Güvenlik İlkeleri

Zorunlu başlıklar:

- password hashing,
- password policy,
- account lockout,
- secure authentication flow,
- authorization,
- role checks,
- resource authorization,
- input validation,
- gerektiğinde rate limiting,
- security headers,
- production HTTPS,
- secret management.

JWT kullanılacaksa token güvenliği ayrıca ele alınacaktır. Browser tarafında hassas token saklama stratejisi gelişigüzel seçilmeyecektir.

---

# 32. Authorization

En kritik güvenlik alanlarından biridir.

Örnek:

Student A:

```text
GET /api/v1/students/B
```

yaparak Student B'nin verisine erişemez.

Advisor A yalnızca kendisine atanmış öğrencileri görür.

Student admin endpoint'lerine erişemez.

Authorization:

```text
Authentication
+
Role Authorization
+
Resource Authorization
```

katmanları ile düşünülmelidir.

---

# 33. KVKK / Privacy

Gerçek okul verileri kullanılmadan önce ilgili kurumun hukuk/idari gereksinimleri ayrıca değerlendirilmelidir.

Teknik prensipler:

- data minimization,
- least privilege,
- retention policy,
- access logging,
- secure deletion/anonymization,
- encrypted transport,
- secure backups.

Development/test ortamına gerçek öğrenci verisi aktarılmayacaktır.

---

# 34. Logging

Production loglarında bulunmaması gerekenler:

- password,
- access token,
- refresh token,
- secret,
- gereksiz PII.

Log seviyeleri:

```text
Debug
Information
Warning
Error
Critical
```

Serilog daha sonra eklenebilir.

---

# 35. Health Check

Backend:

```text
/health
```

endpoint'ine sahip olmalıdır.

Gerekirse daha sonra:

```text
/health/live
/health/ready
```

şeklinde ayrılabilir.

---

# 36. Docker

Local development için PostgreSQL Docker Compose ile çalıştırılabilir.

```text
docker/
└── compose.yml
```

İlk hedefte frontend/backend container'larını zorunlu hale getirerek local geliştirmeyi gereksiz yere karmaşıklaştırma.

---

# 37. Windows 11 Başlangıç Kontrolü

PowerShell'de:

```powershell
dotnet --version
dotnet --list-sdks

node --version
npm --version

 git --version

docker --version
docker compose version

psql --version

python --version
py --version

git config --global user.name
git config --global user.email
```

Visual Studio / VS Code / Cursor / Antigravity sürümleri de proje başlangıcında raporlanabilir.

> Not: `psql` localde kurulu değilse bu tek başına blocker değildir; PostgreSQL Docker üzerinden kullanılabilir. AI bunu kurulum hatası gibi değerlendirmemelidir.

---

# 38. Version Requirements

Hedef:

- .NET 10 LTS
- güncel desteklenen Node.js LTS
- desteklenen güncel PostgreSQL
- güncel Git
- Docker Desktop + Docker Compose
- VS Code veya Visual Studio
- GitHub hesabı
- Vercel hesabı (deployment fazında)

AI coding assistant ilk çalıştırmada gerçek sürümleri kontrol etmelidir; sabit varsayım yapmamalıdır.

9/24/2026 tarihinde resmi kaynaklar açısından doğrulanan referans durum:

- .NET 10 aktif LTS; Microsoft'un güncel destek tablosunda 10.0.12 patch sürümü ve 14 Kasım 2028 destek sonu gösteriliyor.
- Node.js resmi indirme sayfasında 24.21.0 LTS gösteriliyor.
- Vercel, Next.js için doğrudan deployment desteği ve zero-config desteği sunuyor.

Bu sürüm numaraları proje dosyasının değişmez bağımlılık listesi değildir; AI'nin local makinede gerçek sürümü kontrol etmesi zorunludur.

---

# 39. Ücretsiz / Öğrenci Dostu Araçlar

Öncelikli seçenekler:

- GitHub
- GitHub Student Developer Pack
- GitHub Pro öğrenci avantajı
- GitHub Copilot Student uygunluğu varsa
- VS Code
- Visual Studio Community kullanım koşullarına uygunsa
- .NET
- PostgreSQL
- Docker
- Next.js
- React
- Tailwind CSS
- shadcn/ui
- xUnit
- Playwright
- GitHub Actions
- Vercel uygun free-tier senaryolarında

GitHub Student Developer Pack içinde güncel olarak GitHub Pro ve doğrulanmış öğrenciler için GitHub Copilot Student gibi avantajlar bulunmaktadır. Paket içeriği ve limitler değişebileceği için tekliflerin geçerliliği deployment öncesi yeniden kontrol edilmelidir.

---

# 40. GitHub Repository

Repo adı önerisi:

```text
student-advisory
```

Başlangıçta:

```text
Private
```

önerilir.

Gerçek okul verisi, kişisel veri veya secret repository'ye yüklenmeyecektir.

---

# 41. Git Başlangıcı

Local repository:

```powershell
git init
git branch -M main
git status
```

Kimlik kontrolü:

```powershell
git config --global user.name
git config --global user.email
```

İlk checkpoint:

```powershell
git add .
git commit -m "chore: initialize project"
```

GitHub repository oluşturulduktan sonra:

```powershell
git remote add origin https://github.com/USERNAME/student-advisory.git
git push -u origin main
```

`USERNAME` gerçek GitHub kullanıcı adı ile değiştirilecektir.

---

# 42. Git Commit Kuralları

Önerilen prefixler:

```text
feat:
fix:
refactor:
docs:
test:
chore:
build:
ci:
security:
```

Örnek:

```powershell
git add .
git commit -m "feat: add student management module"
git push
```

Her anlamlı checkpoint sonrası push yapılmalıdır.

---

# 43. Git Checkpoint Zorunluluğu

Her büyük faz sonunda AI coding assistant kullanıcıya şu bilgileri vermelidir:

1. ne değişti,
2. build sonucu,
3. test sonucu,
4. manuel doğrulama sonucu,
5. çalıştırma komutları,
6. Git checkpoint komutları.

Örnek:

```powershell
git status
git add .
git commit -m "feat: complete authentication foundation"
git push
```

Broken code commit edilmemelidir.

---

# 44. Branch Strategy

Basit geliştirmede `main` yeterlidir.

Büyük değişikliklerde:

```text
feature/authentication
feature/students
feature/advisors
feature/appointments
```

gibi branch'ler kullanılabilir.

Tek geliştiricili projede her küçük değişiklik için branch açmak zorunlu değildir.

---

# 45. .gitignore Minimum Kurallar

En azından:

```text
.env
.env.*
!.env.example

node_modules/
.next/

bin/
obj/

.vs/
.vscode/

coverage/
TestResults/

*.user
*.suo

logs/
```

Kullanılan araçların standart ignore kuralları da eklenmelidir.

---

# 46. Test Strategy

## Unit Tests

Domain ve application business logic.

## Integration Tests

API + database integration.

## API Tests

Authentication, authorization, validation ve endpoint davranışları.

## E2E Tests

Playwright ile en az:

```text
login
student dashboard
advisor dashboard
appointment creation
appointment confirmation
appointment cancellation
admin user management
```

---

# 47. Minimum Security Tests

En az:

```text
Student A -> Student B verisine erişemez
Advisor A -> Advisor B'nin öğrencisini göremez
Student -> admin endpoint'ine erişemez
Unauthenticated -> protected endpoint'e erişemez
Invalid input -> 400
Nonexistent resource -> 404
Unauthorized role -> 403
Locked account -> login başarısız
Duplicate appointment -> reddedilir
```

---

# 48. CI/CD

GitHub Actions kullanılacaktır.

Temel pipeline:

```text
checkout
restore
build
unit tests
integration tests
frontend install
frontend lint
frontend build
E2E gerektiğinde
```

Örnek:

```text
.github/
└── workflows/
    ├── backend.yml
    ├── frontend.yml
    └── e2e.yml
```

İlk aşamada basit tutulacaktır.

---

# 49. Vercel Deployment Planı

## Kritik mimari not

**Vercel esas olarak Next.js frontend için kullanılacaktır.**

ASP.NET Core backend'in Vercel üzerinde çalıştırılması bu projenin hedefi değildir. Backend ayrı ve internetten erişilebilir bir hosting ortamında çalıştırılacaktır.

Public Vercel frontend bir local adres olan:

```text
http://localhost:xxxx
```

adresine doğrudan erişemez.

Tam public test için backend'in ayrıca erişilebilir olması gerekir.

Hedef mimari:

```text
Internet
   |
   v
Vercel
   |
Next.js Frontend
   |
HTTPS
   |
ASP.NET Core API
   |
PostgreSQL
```

Backend hosting için öğrenci avantajları veya güncel free-tier seçenekleri deployment aşamasında yeniden kontrol edilecektir.

---

# 50. Vercel Test Deployment Aşamaları

1. Frontend local çalışmalı.
2. Backend local çalışmalı.
3. PostgreSQL local çalışmalı.
4. Frontend backend'e bağlanmalı.
5. CORS doğru yapılandırılmalı.
6. Backend test hosting ortamına deploy edilmeli.
7. `/health` doğrulanmalı.
8. Production-benzeri environment variables hazırlanmalı.
9. Frontend Vercel'e deploy edilmeli.
10. `NEXT_PUBLIC_API_BASE_URL` tanımlanmalı.
11. Login test edilmeli.
12. API request test edilmeli.
13. Appointment flow test edilmeli.
14. Authorization test edilmeli.
15. Browser console ve server logs kontrol edilmeli.

Vercel test ortamında gerçek öğrenci verisi kullanılmayacaktır.

---

# 51. CORS

Development örneği:

```text
http://localhost:3000
```

Vercel örneği:

```text
https://<project>.vercel.app
```

Production'da `AllowAnyOrigin()` yaklaşımı kullanılmamalıdır.

İzin verilen origin listesi environment/config üzerinden yönetilmelidir.

---

# 52. Database Migration Süreci

Yeni entity için:

```text
Entity
→ Configuration
→ Migration
→ Build
→ Tests
→ Database Update
→ Verification
```

Örnek:

```powershell
dotnet ef migrations add AddAppointments
dotnet ef database update
```

---

# 53. Seed Data

Development için fake data.

Örnek kullanıcılar:

```text
admin@example.local
advisor@example.local
student@example.local
```

Gerçek okul hesabı veya gerçek öğrenci verisi kullanılmayacaktır.

Development password'ları production şifresi olmayacaktır.

---

# 54. Backup

Production öncesi:

- database backup,
- retention,
- backup encryption,
- restore procedure,
- restore test

tanımlanmalıdır.

**Restore test edilmeden backup stratejisi tamamlanmış sayılmaz.**

---

# 55. Monitoring

Production aşamasında:

- application logs,
- error monitoring,
- health checks,
- database health,
- uptime,
- resource usage

izlenmelidir.

İleride:

- OpenTelemetry,
- metrics,
- distributed tracing

eklenebilir.

---

# 56. Production Güvenlik Kontrol Listesi

- HTTPS
- secure cookies
- CORS
- security headers
- authentication
- authorization
- password policy
- rate limiting
- input validation
- SQL injection koruması
- XSS kontrolü
- CSRF değerlendirmesi
- secret management
- dependency audit
- backup
- restore test
- logging
- monitoring
- audit log
- KVKK/idari review

---

# 57. Geliştirme Fazları

## PHASE 0 — Environment + Repository

### Amaç

Geliştirme makinesini ve GitHub repository'sini doğrulamak.

### Kontroller

```powershell
dotnet --version
dotnet --list-sdks
node --version
npm --version
git --version
docker --version
docker compose version
psql --version
python --version
py --version
git config --global user.name
git config --global user.email
```

### Yapılacaklar

- sürümleri raporla,
- Git config kontrol et,
- GitHub repo oluştur,
- `.gitignore`,
- `.env.example`,
- README,
- PROJECT_PLAN.md,
- temel klasör yapısı,
- initial commit,
- initial push.

### Checkpoint

```powershell
git add .
git commit -m "chore: initialize project"
git push
```

---

## PHASE 1 — Project Skeleton

Kur:

- Next.js + TypeScript,
- Tailwind,
- shadcn/ui,
- ASP.NET Core Web API,
- PostgreSQL,
- Docker Compose,
- Swagger/OpenAPI,
- health check,
- basic tests.

Kontrol:

```text
Frontend çalışıyor
Backend çalışıyor
Database çalışıyor
Swagger açılıyor
Health endpoint çalışıyor
Frontend backend'e erişebiliyor
Testler geçiyor
```

Checkpoint:

```powershell
git add .
git commit -m "feat: create initial application skeleton"
git push
```

---

## PHASE 2 — Database Foundation

- DbContext,
- entities,
- relationships,
- indexes,
- constraints,
- migrations,
- development seed.

Kontrol:

```powershell
dotnet build
dotnet test
dotnet ef database update
```

Checkpoint:

```powershell
git add .
git commit -m "feat: add database foundation"
git push
```

---

## PHASE 3 — Authentication & Authorization

- Identity,
- login,
- logout,
- password hashing,
- roles,
- lockout,
- validation,
- fake users,
- resource authorization,
- security tests.

Checkpoint:

```powershell
git add .
git commit -m "feat: implement authentication and authorization"
git push
```

---

## PHASE 4 — Student Management

- CRUD,
- validation,
- search,
- pagination,
- filtering,
- sorting,
- authorization,
- UI,
- tests.

Checkpoint:

```powershell
git add .
git commit -m "feat: add student management"
git push
```

---

## PHASE 5 — Advisor Management

- CRUD,
- department,
- availability foundation,
- authorization,
- UI,
- tests.

Checkpoint:

```powershell
git add .
git commit -m "feat: add advisor management"
git push
```

---

## PHASE 6 — Advisor Assignment

- student/advisor relationship,
- active assignment,
- historical assignment,
- unique primary assignment rule,
- authorization,
- tests.

Checkpoint:

```powershell
git add .
git commit -m "feat: add advisor assignments"
git push
```

---

## PHASE 7 — Appointments

- availability,
- slot calculation,
- create,
- confirm,
- reject,
- cancel,
- complete,
- no-show,
- concurrency protection,
- notifications,
- tests.

Checkpoint:

```powershell
git add .
git commit -m "feat: add appointment management"
git push
```

---

## PHASE 8 — Meetings

- meeting records,
- summary,
- action items,
- private notes,
- follow-up,
- authorization,
- tests.

Checkpoint:

```powershell
git add .
git commit -m "feat: add meeting management"
git push
```

---

## PHASE 9 — Announcements

- create,
- update,
- publish,
- unpublish,
- target audience,
- UI,
- authorization,
- tests.

Checkpoint:

```powershell
git add .
git commit -m "feat: add announcements"
git push
```

---

## PHASE 10 — Notifications

- in-app notifications,
- unread count,
- mark as read,
- appointment notifications,
- announcement notifications,
- tests.

Checkpoint:

```powershell
git add .
git commit -m "feat: add notifications"
git push
```

---

## PHASE 11 — Academic

- academic years,
- terms,
- departments,
- programs,
- courses,
- optional grade/attendance foundation.

Checkpoint:

```powershell
git add .
git commit -m "feat: add academic management foundation"
git push
```

---

## PHASE 12 — Reports

- dashboard statistics,
- advisor statistics,
- appointment statistics,
- date filters,
- academic period filters,
- authorization.

Checkpoint:

```powershell
git add .
git commit -m "feat: add reporting"
git push
```

---

## PHASE 13 — Security Hardening

- security headers,
- CORS,
- rate limiting,
- validation review,
- auth review,
- authorization review,
- audit review,
- dependency audit,
- secret review.

Checkpoint:

```powershell
git add .
git commit -m "security: harden application security"
git push
```

---

## PHASE 14 — Testing

- unit,
- integration,
- API,
- E2E,
- authorization,
- concurrency,
- regression.

Checkpoint:

```powershell
git add .
git commit -m "test: complete application test coverage"
git push
```

---

## PHASE 15 — CI/CD

- GitHub Actions,
- backend build,
- frontend build,
- tests,
- E2E.

Checkpoint:

```powershell
git add .
git commit -m "ci: add github actions pipelines"
git push
```

---

## PHASE 16 — Vercel Test Deployment

- public test API,
- test PostgreSQL,
- CORS,
- environment variables,
- frontend Vercel deployment,
- login,
- API,
- appointment flow,
- authorization.

Checkpoint:

```powershell
git add .
git commit -m "ci: prepare vercel test deployment"
git push
```

---

## PHASE 17 — Production Readiness

Kontrol:

- domain,
- HTTPS,
- production database,
- backup,
- restore,
- monitoring,
- logs,
- security,
- KVKK,
- disaster recovery,
- pilot plan,
- documentation.

Bu faz tamamlanmadan gerçek okul verisi ile production'a geçilmemelidir.

---

# 58. AI Coding Assistant Çalışma Kuralları

Bu belgeyi kullanan AI coding assistant aşağıdaki kurallara uymalıdır.

## Kural 1

Projeyi tek seferde üretme.

## Kural 2

Her görevden önce repository'yi incele.

## Kural 3

Önce planı açıkla.

## Kural 4

Küçük ve geri alınabilir değişiklikler yap.

## Kural 5

Değişikliklerden sonra uygun build/test çalıştır.

## Kural 6

Hata varsa sonraki adıma geçme.

## Kural 7

Çalışmayan kodu checkpoint olarak commit etme.

## Kural 8

Secret oluşturma veya commit etme.

## Kural 9

Gerçek okul verisi kullanma.

## Kural 10

Frontend authorization'a güvenme.

## Kural 11

Database değişikliklerini migration ile yap.

## Kural 12

Gereksiz dependency ekleme.

## Kural 13

Gereksiz refactor yapma.

## Kural 14

Microservice mimarisine erken geçme.

## Kural 15

Mevcut çalışan kodu gerekmedikçe bozma.

## Kural 16

Her büyük fazın sonunda Git checkpoint öner.

## Kural 17

Büyük mimari değişiklikleri kullanıcıya açıkça bildir.

## Kural 18

Bir sonraki faza geçmeden önce mevcut fazın doğrulamasını göster.

---

# 59. AI Çalışma Döngüsü

Her görev için:

```text
1. Inspect repository
2. Report current state
3. Explain plan
4. Implement small change
5. Build
6. Test
7. Fix errors
8. Re-run build/test
9. Manual verification steps
10. Git checkpoint
11. If phase complete, move to next phase
```

---

# 60. "Done" Tanımı

Bir özellik ancak:

```text
Kod yazıldı
+
Build başarılı
+
Testler başarılı
+
Authentication kontrol edildi (gerekiyorsa)
+
Authorization kontrol edildi
+
Validation eklendi
+
Loading state var
+
Error state var
+
Empty state var
+
Database migration hazır (gerekiyorsa)
+
Swagger/API kontrol edildi
+
UI kontrol edildi
+
Dokümantasyon güncellendi
+
Git checkpoint oluşturuldu
```

koşullarını karşılıyorsa tamamlanmış sayılır.

---

# 61. İlk Gün Yapılacaklar

Kullanıcı:

1. GitHub hesabını kontrol eder.
2. GitHub Student Developer Pack uygunluğunu kontrol eder.
3. GitHub'da private repository oluşturur.
4. Proje klasörünü oluşturur.
5. `PROJECT_PLAN.md` dosyasını repository root'a koyar.
6. Cursor/Antigravity'yi repository root'ta açar.
7. AI'ya version check yaptırır.
8. Local environment sorunlarını giderir.
9. İlk skeleton'ı oluşturur.
10. Local build/test yapar.
11. İlk Git checkpoint'i oluşturur.
12. GitHub'a push eder.

---

# 62. İlk Git Checkpoint Komutları

İlk repository hazırlığında:

```powershell
git status
git add .
git commit -m "chore: initialize project"
git push -u origin main
```

İlk skeleton sonrasında:

```powershell
git status
git add .
git commit -m "feat: create initial application skeleton"
git push
```

---

# 63. Günlük Git Rutini

Çalışma başında:

```powershell
git status
git pull
```

Çalışma sırasında gerektiğinde:

```powershell
git status
```

Çalışma sonunda uygun kontroller:

```powershell
dotnet build
dotnet test
npm run lint
npm run build
```

Sonra:

```powershell
git add .
git commit -m "..."
git push
```

---

# 64. Hata Yönetimi

Bir hata bulunduğunda AI:

```text
ERROR
↓
Root Cause
↓
Minimal Fix
↓
Regression Test
↓
Build/Test
↓
Verification
```

sürecini izlemelidir.

Hata gizlenmemelidir.

---

# 65. Production Hedef Mimarisi

```text
                   Internet
                       |
                     HTTPS
                       |
                     Nginx
                       |
          +------------+------------+
          |                         |
      Next.js                   ASP.NET Core
       Frontend                    API
          |                         |
          |                    EF Core
          |                         |
          +------------------- PostgreSQL
                                    |
                                  Backup
```

Opsiyonel:

```text
Redis
Hangfire
OpenTelemetry
Serilog
```

---

# 66. Development Mimarisi

```text
Windows 11
   |
   +-- VS Code / Visual Studio
   |
   +-- Cursor / Antigravity
   |
   +-- Next.js
   |
   +-- ASP.NET Core
   |
   +-- PostgreSQL Docker
   |
   +-- Git
   |
   +-- GitHub
```

---

# 67. Vercel Test Mimarisi

```text
Browser
   |
   v
Vercel
   |
Next.js
   |
HTTPS API
   |
ASP.NET Core
   |
PostgreSQL
```

Local:

```text
Browser -> localhost frontend -> localhost API
```

Vercel:

```text
Browser -> Vercel frontend -> public API
```

---

# 68. Deployment Secret Yönetimi

Local:

```text
.env
.env.local
```

CI/CD:

```text
GitHub Actions Secrets
```

Vercel:

```text
Vercel Environment Variables
```

Backend hosting:

```text
Provider Environment Variables / Secret Store
```

GitHub repository içinde gerçek secret tutulmayacaktır.

---

# 69. Production'a Geçmeden Önce Zorunlu Kontroller

```text
[ ] Production database hazır
[ ] HTTPS aktif
[ ] Domain hazır
[ ] CORS sınırlandırıldı
[ ] Authentication test edildi
[ ] Authorization test edildi
[ ] Audit logs çalışıyor
[ ] Backup çalışıyor
[ ] Restore test edildi
[ ] Monitoring hazır
[ ] Error logging hazır
[ ] Secrets güvenli
[ ] Dependency audit tamam
[ ] KVKK/idari değerlendirme tamam
[ ] Pilot plan hazır
[ ] Documentation tamam
```

---

# 70. Projenin Genel Başarı Kriteri

Proje:

- localde tekrar kurulabilir,
- temiz makinede dokümantasyon ile ayağa kaldırılabilir,
- migration ile database kurulabilir,
- testleri çalışabilir,
- authentication güvenli çalışabilir,
- authorization doğru çalışabilir,
- appointment concurrency sorunu çözülebilir,
- frontend responsive olabilir,
- Vercel frontend deployment yapılabilir,
- public test API'ye bağlanabilir,
- GitHub Actions çalışabilir,
- backup/restore prosedürü belgelenebilir,
- production'a geçmeden güvenlik review'undan geçirilebilir

olmalıdır.

---

# 71. AI'ya Başlangıç Talimatı

Aşağıdaki metni Cursor / Antigravity / başka bir AI coding assistant'a başlangıç promptu olarak ver:

> Bu repository'nin ana teknik sözleşmesi `PROJECT_PLAN.md` dosyasıdır.
>
> Öncelikle bu dosyayı tamamen oku ve kurallarına uy.
>
> Projeyi tek seferde oluşturma.
>
> **PHASE 0 ile başla.**
>
> Önce repository'nin mevcut durumunu incele.
>
> Aşağıdaki sürümleri PowerShell ile kontrol et:
>
> ```powershell
> dotnet --version
> dotnet --list-sdks
> node --version
> npm --version
> git --version
> docker --version
> docker compose version
> psql --version
> python --version
> py --version
> git config --global user.name
> git config --global user.email
> ```
>
> Hedef teknoloji:
>
> - .NET 10 LTS
> - güncel desteklenen Node.js LTS
> - desteklenen PostgreSQL
> - Git
> - Docker Desktop
> - Next.js
> - TypeScript
> - ASP.NET Core
>
> Mevcut sürümleri raporla.
>
> Uyumsuzluk varsa önce açıkla, sonra en az riskli çözümü uygula veya öner.
>
> Ardından yalnızca PHASE 0'ı tamamla.
>
> GitHub repository durumunu kontrol et.
>
> `.gitignore`, `.env.example`, `README.md`, `PROJECT_PLAN.md` ve gerekli temel klasör yapısını hazırla.
>
> Projenin sonraki fazlarını erken uygulama.
>
> Her aşamada:
>
> ```text
> inspect
> plan
> implement
> build
> test
> fix
> verify
> git checkpoint
> ```
>
> döngüsünü kullan.
>
> Bir faz çalışmadan sonraki faza geçme.
>
> Secret commit etme.
>
> Gerçek okul verisi kullanma.
>
> Frontend authorization'a güvenme.
>
> Backend authorization zorunlu.
>
> Database değişikliklerini migration ile yap.
>
> Gereksiz dependency, abstraction veya refactor yapma.
>
> Microservice kullanma.
>
> Her büyük değişiklikten sonra Git checkpoint komutlarını ver.
>
> Bir hata varsa gizleme; root cause, çözüm ve verification sonucunu raporla.
>
> Her fazın sonunda şu formatta rapor ver:
>
> ```text
> PHASE X — RESULT
>
> Build: PASS / FAIL
> Tests: PASS / FAIL
> Manual Verification: PASS / FAIL
> Database: PASS / FAIL / N/A
> Security: PASS / FAIL / N/A
> Git: READY / NOT READY
> Next Step: ...
> ```
>
> **Şimdi yalnızca PHASE 0 ile başla.**

---

# 72. AI İçin Faz Geçiş Kuralı

AI:

```text
PHASE N tamamlanmadan
PHASE N+1'e geçemez.
```

Geçiş için en az:

```text
Build = PASS
Tests = PASS
Manual Verification = PASS
Critical Security Checks = PASS
```

olmalıdır.

---

# 73. Değişiklik Günlüğü

`CHANGELOG.md` içinde önemli değişiklikler tutulacaktır.

Örnek:

```text
## [0.1.0] - Development

### Added
- Initial project structure
- Frontend
- Backend
- PostgreSQL
- Health check
- Swagger
```

---

# 74. Son Kontrol Listesi

## Environment

```text
[ ] Windows 11
[ ] .NET
[ ] Node.js
[ ] npm
[ ] Git
[ ] Docker
[ ] PostgreSQL / Docker PostgreSQL
[ ] VS Code / Visual Studio
[ ] Cursor / Antigravity
[ ] GitHub
```

## Repository

```text
[ ] Git initialized
[ ] main branch
[ ] GitHub repository
[ ] .gitignore
[ ] .env.example
[ ] README
[ ] PROJECT_PLAN
```

## Backend

```text
[ ] ASP.NET Core
[ ] EF Core
[ ] PostgreSQL
[ ] Identity
[ ] Swagger
[ ] Health
[ ] Authorization
```

## Frontend

```text
[ ] Next.js
[ ] TypeScript
[ ] Tailwind
[ ] shadcn/ui
[ ] Forms
[ ] Validation
[ ] Responsive
```

## Quality

```text
[ ] Unit tests
[ ] Integration tests
[ ] API tests
[ ] E2E tests
[ ] CI
```

## Deployment

```text
[ ] Docker
[ ] Vercel
[ ] Public test API
[ ] PostgreSQL test DB
[ ] Environment variables
[ ] CORS
```

## Production

```text
[ ] HTTPS
[ ] Domain
[ ] Backup
[ ] Restore
[ ] Monitoring
[ ] Security review
[ ] KVKK review
[ ] Disaster recovery
```

---

# 75. Güncel Resmi Kaynaklar

Bu bölüm özellikle sürüm ve öğrenci avantajları gibi zamanla değişebilecek bilgiler için kullanılacaktır.

- .NET Support Policy: https://dotnet.microsoft.com/platform/support/policy
- Node.js Downloads: https://nodejs.org/en/download/
- GitHub Student Developer Pack: https://education.github.com/pack
- Vercel + Next.js: https://vercel.com/frameworks/nextjs

> Bu kaynaklar resmi sayfalardır. Sürümler, fiyatlar, free-tier limitleri ve öğrenci teklifleri zaman içinde değişebilir. Deployment aşamasında yeniden kontrol edilmelidir.

---

# 76. Son Prensip

Bu proje için en önemli prensip:

> **Önce çalışan, test edilmiş ve güvenli küçük bir parça; sonra bir sonraki parça.**

Hızlıca çok miktarda kod üretmek hedef değildir.

Hedef:

```text
Doğru mimari
+
Güvenlik
+
Test edilebilirlik
+
Sürdürülebilirlik
+
Dokümantasyon
+
Kontrollü deployment
```

olmalıdır.

Gerçek okul kullanımına aday bir sistem olduğu için:

**"Çalışıyor gibi görünmesi" yeterli değildir.**

Her önemli özellik:

```text
implement
→ build
→ test
→ security check
→ manual verification
→ documentation
→ git checkpoint
```

sürecinden geçmelidir.

---

# PROJECT PLAN END
