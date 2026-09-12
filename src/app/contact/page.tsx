"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageCircle, Mail } from "lucide-react";

const contacts = {
  karas: {
    name: "mrKaras",
    phone: "+201204398754",
  },
  avram: {
    name: "mrAvram",
    phone: "+201092560414",
  },
  sharif: {
    name: "mrSharif",
    phone: "+201274068946",
    email: "shireffn369@gmail.com",
  },
};

export default function ContactPage() {
  const t = useTranslations("contact");
  const tAuth = useTranslations("auth");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    recipient: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecipientChange = (value: string | null) => {
    setFormData({ ...formData, recipient: value || "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipient) {
      alert(t("selectRecipientPlaceholder"));
      return;
    }

    const contact = contacts[formData.recipient as keyof typeof contacts];
    const whatsappMessage = `*الاسم:* ${formData.name}%0A*الهاتف:* ${formData.phone}%0A%0A*الرسالة:*%0A${formData.message}`;
    const whatsappUrl = `https://wa.me/${contact.phone}?text=${whatsappMessage}`;

    window.open(whatsappUrl, "_blank");

    // Reset form
    setFormData({ name: "", phone: "", message: "", recipient: "" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-6">{t("howCanWeHelp")}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t("helpDescription")}
                </p>
              </div>

              {/* Business Owners */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-indigo-600">{t("businessOwners")}</h3>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2">{t("mrKaras")}</h4>
                    <a
                      href={`https://wa.me/${contacts.karas.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
                      dir="ltr"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {contacts.karas.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold mb-2">{t("mrAvram")}</h4>
                    <a
                      href={`https://wa.me/${contacts.avram.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                      dir="ltr"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {contacts.avram.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Technical Support */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-green-600">{t("technicalSupport")}</h3>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg font-bold">{t("mrSharif")}</h4>
                    <a
                      href={`https://wa.me/${contacts.sharif.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                      dir="ltr"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {contacts.sharif.phone}
                    </a>
                    <a
                      href={`mailto:${contacts.sharif.email}`}
                      className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      {contacts.sharif.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <h3 className="text-xl font-bold mb-3">{t("workingHours")}</h3>
                <div className="space-y-2">
                  <p>{t("workingDays")}</p>
                  <p>{t("friday")}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">{t("sendMessage")}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">{t("selectRecipient")}</Label>
                  <Select value={formData.recipient} onValueChange={handleRecipientChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t("selectRecipientPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="karas">{t("mrKaras")}</SelectItem>
                      <SelectItem value="avram">{t("mrAvram")}</SelectItem>
                      <SelectItem value="sharif">{t("mrSharif")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phoneNumber")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("message")}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6 rounded-full bg-green-600 hover:bg-green-700"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {t("send")}
                  </span>
                </Button>

                <p className="text-sm text-center text-gray-500">
                  {t("successMessage")}
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
