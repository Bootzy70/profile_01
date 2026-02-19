import React, { useMemo, useState } from 'react'
import { activities, semesters } from './data.js'

const BASE_URL = import.meta.env.BASE_URL || '/'

function resolveAssetUrl(url) {
  if (!url) return url
  if (/^(https?:)?\/\//i.test(url)) return url
  if (url.startsWith('data:') || url.startsWith('blob:')) return url

  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`
  if (url.startsWith('/')) return base + url.slice(1)
  return base + url
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs text-brand-800">
      {children}
    </span>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function SemesterTabs({ value, onChange }) {
  const items = [semesters['1/2568'], semesters['2/2568']]

  return (
    <div className="inline-flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm text-slate-600">เลือกภาคเรียน</div>
        <div className="mt-2 inline-flex rounded-2xl border border-brand-200 bg-white p-1 shadow-soft">
          {items.map((s) => {
            const active = s.key === value
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onChange(s.key)}
                className={
                  'rounded-xl px-4 py-2 text-sm transition ' +
                  (active
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-700 hover:bg-brand-50')
                }
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
        <div className="text-sm font-medium text-slate-900">สรุป</div>
        <div className="mt-1 text-xs text-slate-600">
          ตารางเรียนและแผนการสอนจะเปลี่ยนตามภาคเรียนที่เลือก
        </div>
      </div>
    </div>
  )
}

function Carousel({ images, title }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : []
  const [index, setIndex] = useState(0)

  if (safeImages.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-sm text-slate-500">
        ไม่มีรูปภาพ
      </div>
    )
  }

  const current = safeImages[Math.min(index, safeImages.length - 1)]
  const canNavigate = safeImages.length > 1

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-soft">
      <div className="aspect-[16/10] w-full overflow-hidden bg-brand-50">
        <img
          key={current}
          src={resolveAssetUrl(current)}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {canNavigate ? (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-slate-900 backdrop-blur hover:bg-white"
            aria-label="ก่อนหน้า"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % safeImages.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-slate-900 backdrop-blur hover:bg-white"
            aria-label="ถัดไป"
          >
            ›
          </button>
        </>
      ) : null}
    </div>
  )
}

function ActivityCard({ activity, reverse }) {
  const [expanded, setExpanded] = useState(false)
  const hasLongDescription =
    typeof activity.description === 'string' && activity.description.length > 220
  const hasHighlights = Array.isArray(activity.highlights) && activity.highlights.length > 0
  const canExpand = hasLongDescription || hasHighlights

  const contentPanelClass =
    'relative mt-3 rounded-2xl border border-brand-100 bg-brand-50/40 p-4 ' +
    'transition-[max-height] duration-300 ease-in-out '

  const contentStateClass = expanded
    ? 'max-h-[420px] overflow-y-auto pr-2'
    : 'max-h-[180px] overflow-hidden'

  return (
    <article className="rounded-3xl border border-brand-200 bg-white p-6 shadow-soft">
      <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
        <div className={(reverse ? 'md:order-2' : 'md:order-1') + ' flex flex-col'}>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>{activity.date}</Pill>
            <Pill>{activity.location}</Pill>
          </div>

          <h3
            className={
              'mt-4 text-lg font-semibold text-slate-900 md:text-xl ' +
              (expanded ? '' : 'line-clamp-2')
            }
          >
            {activity.title}
          </h3>

          <div className={contentPanelClass + contentStateClass}>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {activity.description}
            </p>

            {expanded && hasHighlights ? (
              <div className="mt-5">
                <div className="text-sm font-semibold text-slate-900">สาระสำคัญ</div>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {activity.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {!expanded ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>

          {canExpand ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
                aria-expanded={expanded}
              >
                <span>{expanded ? 'ย่อรายละเอียด' : 'ดูเพิ่มเติม'}</span>
                <span
                  className={
                    'inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition ' +
                    (expanded ? 'rotate-180' : 'rotate-0')
                  }
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>
            </div>
          ) : null}

          <div className="mt-auto" />
        </div>

        <div className={reverse ? 'md:order-1' : 'md:order-2'}>
          <Carousel images={activity.images} title={activity.title} />
          <div className="mt-3 text-xs text-slate-500">
            รูปทั้งหมด: {Array.isArray(activity.images) ? activity.images.length : 0}
          </div>
        </div>
      </div>
    </article>
  )
}

function ScheduleTable({ schedule }) {
  const meta = schedule?.meta
  const subjects = Array.isArray(schedule?.subjects) ? schedule.subjects : []
  const periods = Array.isArray(schedule?.periods) ? schedule.periods : []
  const days = Array.isArray(schedule?.days) ? schedule.days : []

  const renderDayCells = (dayKey) => {
    const tds = []

    for (let i = 0; i < periods.length; i += 1) {
      const p = periods[i]

      if (p.isBreak) {
        tds.push(
          <td
            key={p.key}
            className="border border-brand-200 bg-brand-50/70"
          />,
        )
        continue
      }

      const cell = schedule?.grid?.[dayKey]?.[p.key]
      if (!cell) {
        tds.push(
          <td
            key={p.key}
            className="border border-brand-200 bg-white/80"
          />,
        )
        continue
      }

      const span =
        typeof cell.span === 'number' && Number.isFinite(cell.span) && cell.span > 1
          ? Math.floor(cell.span)
          : 1

      tds.push(
        <td
          key={p.key}
          colSpan={span}
          className="border border-brand-200 bg-white px-2 py-2"
        >
          <div className="text-center text-xs leading-snug">
            <div className="font-semibold">{cell.code}</div>
            <div className="text-slate-700">{cell.room}</div>
          </div>
        </td>,
      )

      if (span > 1) {
        i += span - 1
      }
    }

    return tds
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-sm text-slate-900">
            <tbody>
              <tr>
                <td className="w-[240px] border border-brand-200 bg-brand-50/40 p-4 align-top">
                  <div className="text-base font-semibold">{meta?.school ?? 'สถานศึกษา'}</div>
                  <div className="mt-3 grid gap-2 text-sm">
                    <div className="grid grid-cols-[84px_1fr] gap-2">
                      <div className="font-semibold">ภาคเรียน</div>
                      <div>{meta?.term ?? '-'}</div>
                    </div>
                    <div className="grid grid-cols-[84px_1fr] gap-2">
                      <div className="font-semibold">ครูผู้สอน</div>
                      <div>{meta?.teacher ?? '-'}</div>
                    </div>
                    <div className="grid grid-cols-[84px_1fr] gap-2">
                      <div className="font-semibold">รหัสกลุ่ม</div>
                      <div>{meta?.groupCode ?? '-'}</div>
                    </div>
                    <div className="grid grid-cols-[84px_1fr] gap-2">
                      <div className="font-semibold">ชื่อกลุ่ม</div>
                      <div>{meta?.groupName ?? '-'}</div>
                    </div>
                  </div>
                </td>

                <td className="border border-brand-200 p-0 align-top">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-brand-50/70">
                        <th className="border border-slate-300 px-3 py-2 text-center font-semibold">
                          รหัสวิชา
                        </th>
                        <th className="border border-slate-300 px-3 py-2 text-center font-semibold">
                          ชื่อรายวิชา
                        </th>
                        <th className="border border-slate-300 px-3 py-2 text-center font-semibold">
                          ท/ป/น
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.length === 0 ? (
                        <tr>
                          <td
                            className="border border-brand-200 px-3 py-6 text-center text-slate-500"
                            colSpan={3}
                          >
                            ยังไม่มีรายการรายวิชา
                          </td>
                        </tr>
                      ) : (
                        subjects.map((s) => (
                          <tr key={s.code}>
                            <td className="border border-brand-200 px-3 py-2">
                              {s.code}
                            </td>
                            <td className="border border-brand-200 px-3 py-2">
                              {s.name}
                            </td>
                            <td className="border border-brand-200 px-3 py-2 text-center">
                              {s.tpn}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse text-sm text-slate-900">
            <thead>
              <tr className="bg-brand-50/70">
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold">
                  เวลา / วัน
                </th>
                {periods.map((p) => (
                  <th
                    key={p.key}
                    className={
                      'border border-brand-200 px-3 py-2 text-center font-semibold ' +
                      (p.isBreak ? 'bg-brand-50/80' : '')
                    }
                  >
                    <div className="whitespace-nowrap">{p.time}</div>
                    <div className="mt-1 text-xs font-medium text-slate-600">
                      {p.isBreak ? 'พัก' : p.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.key}>
                  <td className="border border-brand-200 bg-brand-50/40 px-3 py-3 font-semibold">
                    {d.label}
                  </td>
                  {renderDayCells(d.key)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function LessonPlans({ plans }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl border border-brand-200 bg-white p-5 shadow-soft"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-600">วิชา</div>
              <div className="mt-1 text-base font-semibold text-slate-900">
                {p.subject}
              </div>
              <div className="mt-2 text-sm text-slate-700">หัวข้อ: {p.topic}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={resolveAssetUrl(p.downloadUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                ดู
              </a>
              <a
                href={resolveAssetUrl(p.downloadUrl)}
                download
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                ดาวน์โหลด
              </a>
            </div>
          </div>
          <div className="mt-3 break-all text-xs text-slate-500">
            ลิงก์: {p.downloadUrl}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [semesterKey, setSemesterKey] = useState('1/2568')

  const semester = useMemo(() => semesters[semesterKey], [semesterKey])

  return (
    <div className="min-h-screen bg-white">
      <header className="relative overflow-hidden border-b border-brand-200 bg-brand-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.10),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.15),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2">
                <Pill>Portfolio</Pill>
                <Pill>นักศึกษาฝึกสอน</Pill>
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                เว็บไซต์แสดงผลงานนักศึกษาฝึกสอน
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-700 md:text-base">
                รวบรวมกิจกรรม ตารางเรียน และแผนการสอน โดยสามารถเลือกภาคเรียนเพื่อดูข้อมูลที่ตรงกัน
              </p>
            </div>

            <div className="rounded-2xl border border-brand-200 bg-white p-4 shadow-soft">
              <div className="text-xs text-slate-600">ข้อมูลผู้จัดทำ</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                นายบุศย์ จินะโต้ง
              </div>
              <div className="mt-1 text-xs text-slate-600">
                เทคโนโลยีธุรกิจดิจิทัล วิทยาลัยการอาชีพวังไกลกังวล ๒
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Section
          title={
            <span className="inline-flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
              <span className="text-2xl font-semibold tracking-tight text-brand-900 md:text-3xl">
                กิจกรรม
              </span>
            </span>
          }
          subtitle="แสดงกิจกรรมที่ได้ทำระหว่างฝึกสอน (รูปอยู่ด้านขวา รายละเอียดอยู่ด้านซ้าย และสลับด้านในกิจกรรมถัดไป)"
        >
          <div className="space-y-6">
            {activities.map((a, idx) => (
              <ActivityCard
                key={a.id}
                activity={a}
                reverse={idx % 2 === 1}
              />
            ))}
          </div>
        </Section>

        <Section
          title={
            <span className="inline-flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
              <span className="text-2xl font-semibold tracking-tight text-brand-900 md:text-3xl">
                เลือกภาคเรียน
              </span>
            </span>
          }
          subtitle="หลังจากแสดงกิจกรรมทั้งหมดแล้ว เลือกภาคเรียนเพื่อดูตารางเรียนและแผนการสอน"
        >
          <SemesterTabs value={semesterKey} onChange={setSemesterKey} />
        </Section>

        <Section
          title={
            <span className="inline-flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
              <span className="text-2xl font-semibold tracking-tight text-brand-900 md:text-3xl">
                ตารางเรียน
              </span>
            </span>
          }
          subtitle={semester.label}
        >
          {semester.teachingProjectUrl ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-slate-900">โครงการสอน</div>
              <a
                href={resolveAssetUrl(semester.teachingProjectUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                ดู
              </a>
              <a
                href={resolveAssetUrl(semester.teachingProjectUrl)}
                download
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                ดาวน์โหลด
              </a>
            </div>
          ) : null}
          <ScheduleTable schedule={semester.schedule} />
        </Section>

        <Section
          title={
            <span className="inline-flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
              <span className="text-2xl font-semibold tracking-tight text-brand-900 md:text-3xl">
                แผนการสอน
              </span>
            </span>
          }
          subtitle="แผนการสอนจะระบุว่าเป็นวิชาอะไรตามตาราง และมีลิงก์ดาวน์โหลด"
        >
          <LessonPlans plans={semester.lessonPlans} />
        </Section>
      </main>

      <footer className="border-t border-brand-200 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-2 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} ผลงานนักศึกษาฝึกสอน</div>
            <div>
              นายบุศย์ จินะโต้ง <br />
              มหาวิทยาลัยราชมงคลล้านนา เชียงใหม่<br />
              เบอร์ : 065-383-5532<br />
              Email : Bootchinatong@gmail.com
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
