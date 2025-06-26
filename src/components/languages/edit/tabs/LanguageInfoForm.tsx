interface Props {
  language: any
}

export function LanguageInfoForm({ language }: Props) {
  return (
    <div className="space-y-4">
      <div><strong>Name:</strong> {language.name}</div>
      <div><strong>Culture:</strong> {language.languageCulture}</div>
      <div><strong>SEO Code:</strong> {language.uniqueSeoCode}</div>
      <div><strong>Display Order:</strong> {language.displayOrder}</div>
      <div><strong>RTL:</strong> {language.rtl ? "Yes" : "No"}</div>
      <div><strong>Published:</strong> {language.published ? "Yes" : "No"}</div>
    </div>
  )
}
