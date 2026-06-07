import { motion } from "framer-motion";
import { Check, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";

export interface ServiceFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface ServicePricingTier {
  badge: string;
  price: string;
  note: string;
  highlight?: boolean;
}

export interface GalleryPair {
  before: string;
  after: string;
  label?: string;
}

export interface ServicePageData {
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage?: string;
  heroVideo?: string;
  features: ServiceFeature[];
  scopeItems: string[];
  pricingTiers: ServicePricingTier[];
  gallery?: GalleryPair[];
  serviceFolder: string;
}

function BeforeAfterSlider({ before, after, label }: GalleryPair) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const updatePos = (clientX: number) => {
    if (!ref.current) return;
    const { left, width } = ref.current.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - left) / width) * 100)));
  };
  return (
    <div className="w-full flex flex-col items-center">
      {label && <p className="mb-3 text-sm font-bold text-foreground">{label}</p>}
      <div
        ref={ref}
        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden cursor-col-resize select-none shadow-md"
        onMouseMove={(e) => { if (dragging.current) updatePos(e.clientX); }}
        onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onTouchMove={(e) => updatePos(e.touches[0].clientX)}
        onTouchStart={(e) => updatePos(e.touches[0].clientX)}
      >
        <img src={before} alt="청소 전" draggable={false} className="absolute inset-0 h-full w-full object-cover bg-gray-100" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={after} alt="청소 후" draggable={false} className="absolute inset-0 h-full w-full object-cover bg-gray-100" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.35)]"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 8H1M1 8L3 6M1 8L3 10M11 8H15M15 8L13 6M15 8L13 10" stroke="#1B2F57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <span className="absolute left-2 top-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white pointer-events-none">전</span>
        <span className="absolute right-2 top-2 rounded-md bg-primary/80 px-2 py-0.5 text-[10px] font-bold text-white pointer-events-none">후</span>
      </div>
    </div>
  );
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  const heroBadges = ["대표 직접 관리", "정기 계약", "당일 견적"];

  return (
    <>
      <Navbar />

      {/* Fixed parallax video — sits behind everything, only visible through hero */}
      {data.heroVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 w-full h-full object-cover"
          style={{ zIndex: -10 }}
        >
          <source src={data.heroVideo} type="video/mp4" />
        </video>
      )}

      <main className="min-h-screen">
        {/* Hero */}
        <section
          className="relative flex h-screen min-h-[620px] flex-col items-center justify-center"
          style={
            !data.heroVideo && data.heroBgImage
              ? { backgroundImage: `url(${data.heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {}
          }
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 text-center">
            {/* Badge tag */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-semibold text-white/90 tracking-[0.2em] uppercase">이천 청�;(!:�.��[����[�[ۋ�]�����ʈ]H
��B�[�[ۋ�B�[�]X[^���X�]N�N��_B�[�[X]O^���X�]N�KN�_B��[��][ۏ^��\�][ێ���K[^N��H_B��\�Ә[YOH�^M�۝Y^�X��XY[��]Y�^]�]H�N�^M^Y�^M�Ν^M��۝V���X\��]�[���H�]\�X�K\�K[[�H��\�Y��L������]K�\��]_B��[�[ۋ�O����ʈX��[�[�H
��B�[�[ۋ�]��[�]X[^����[V�_B�[�[X]O^����[V�H_B��[��][ۏ^��\�][ێ��MK[^N���_B��\�Ә[YOH�^X]]�]M�L�H�LM�ܚY�[�X�[�\���\�[X\�H��ς���ʈ�X�]H
��B�[�[ۋ��[�]X[^���X�]N�N�M�_B�[�[X]O^���X�]N�KN�_B��[��][ۏ^��\�][ێ���[^N���_B��\�Ә[YOH�]MH^X�\�H�۝[YY][H^]�]K��H�N�^[�Y�^^�����]K�\���X�]_B��[�[ۋ�����ʈ�X]\�H[�
��B�[�[ۋ�]��[�]X[^���X�]N�N�M�_B�[�[X]O^���X�]N�KN�_B��[��][ۏ^��\�][ێ���[^N��
�_B��\�Ә[YOH�]M��^�^]ܘ\�\�Y�KX�[�\��\L������\�ИY�\˛X\

�HO�
��[���^O^؟B��\�Ә[YOH���[�YY�[��]�]K�L�X����X�\�\�H�ܙ\��ܙ\�]�]ǨLˍHKLH^^��۝\�[ZX��^]�]K�L����؟B���[���
J_B��[�[ۋ�]�����ʈ�\�
��B�[�[ۋ�]��[�]X[^���X�]N�N�M�_B�[�[X]O^���X�]N�KN�_B��[��][ۏ^��\�][ێ���[^N��M�_B��\�Ә[YOH�]LL�^�^X��][\�X�[�\��\�Y�KX�[�\��\L��N��^\��Ȃ���B��Y�H�[��KM��ML���\�Ә[YOH�[�[�KY�^][\�X�[�\��\L���[�YY�[��\�[X\�HM�KLˍH^\�H�۝X��^]�]H�Y��[�ݙ\����\�[X\�K�L�[��][ۋX[ݙ\����[KLL
H����ۙH�\�Ә[YOH�M�M�ς�;(!;fe; �z����O��B��Y�H�΋�����Z�[˘��K������]��\��]H�؛[�Ȃ��[H����[�\��ܙY�\��\����\�Ә[YOH�[�[�KY�^][\�X�[�\��\L���[�YY�[�ܙ\��ܙ\�]�]K��H��]�]K�L�X����X�\�\�HM�KLˍH^\�H�۝X��^]�]Hݙ\����]�]Ǩ�[��][ۋX[ݙ\����[KLL
H����Y\��Y�P�\��H�\�Ә[YOH�M�M�ς�;.m;.m;&); �z����O���[�[ۋ�]����]�����ʈ�ܛ�[�X�]܈
��B�[�[ۋ�]��[�]X[^���X�]N�_B�[�[X]O^���X�]N�H_B��[��][ۏ^��\�][ێ�K[^N�K��_B��\�Ә[YOH�X���]H���KNY�LK̈]�[��]K^LK̈�^�^X��][\�X�[�\��\LK�H�����[��\�Ә[YOH�^V�LH�۝[YY][H^]�]K��X��[��V���Y[WH\\��\�H���ܛ���[���[�[ۋ�]��[�[X]O^��N��
�H_B��[��][ۏ^��\�][ێ�K�K�\X]�[��[�]KX\�N��X\�R[��]�_B����]��ۑ�ۈ�\�Ә[YOH�MH�MH^]�]K��ς��[�[ۋ�]����[�[ۋ�]�����X�[ۏ����ʈ�X]\�\�8�%��Y���ݙ\���^Y�Y[�
��B��X�[ۈ�\�Ә[YOH��[]]�H��]�]HKLM�Y�KL���[O^���[�^�L_O��]��\�Ә[YOH��۝Z[�\�^X]]�M���[�[ۋ���[�]X[^���X�]N�N��_B��[R[��Y]�^���X�]N�KN�_B��Y]�ܝ^��ۘ�N��YH_B��\�Ә[YOH�X�LL^X�[�\�^L��۝Y^�X��^Y�ܙYܛ�[��N�^L�����;!':�a;"�;b�{)�B��[�[ۋ����]��\�Ә[YOH�ܚY�\M��N�ܚYX���L�ΙܚYX���M����]K��X]\�\˛X\

�JHO�
�[�[ۋ�]���^O^�_B�[�]X[^���X�]N�N��_B��[R[��Y]�^���X�]N�KN�_B��Y]�ܝ^��ۘ�N��YH_B��[��][ۏ^��[^N�H
��_B��\�Ә[YOH���[�YL��ܙ\��ܙ\�Yܘ^KLL��Yܘ^KMLM�ݙ\���Y��[Y�[��][ۋ\�Y�Ȃ�����\�Ә[YOH�X�L��۝X��^Y�ܙYܛ�[���ً�]_O�ς��\�Ә[YOH�^\�HXY[��\�[^Y^[]]YY�ܙYܛ�[���ً�\�ܚ\[۟O����[�[ۋ�]���
J_B��]����]�����X�[ۏ����ʈ�[\�H
��B��]K��[\�H	��]K��[\�K�[���	��
��X�[ۈ�\�Ә[YOH��[]]�H��Yܘ^KMLKLM�Y�KL���[O^���[�^�L_O��]��\�Ә[YOH��۝Z[�\�^X]]�M���[�[ۋ���[�]X[^���X�]N�N��_B��[R[��Y]�^���X�]N�KN�_B��Y]�ܝ^��ۘ�N��YH_B��\�Ә[YOH�X�LL^X�[�\�^L��۝Y^�X��^Y�ܙYܛ�[��N�^L�����;,�xh��L+~ٸB��N�Y �����F����#��F�b6�74��S�&w&�Bw&�B�6��2�vӂ6Ӧw&�B�6��2�"�C�v����r�7��ׂ�WF�#��FF�v��W'������"����������F����F�`��W�׶�Т��F��׷��6�G�����#�Тv���T��f�Ws׷��6�G������Тf�Ww�'C׷���6S�G'VR�ТG&�6�F���׷�FV�������Т6�74��S�'r�gV�� ���&Vf�&TgFW%6ƖFW"�����'�������F����F�c���Т��F�c���F�c���6V7F�����Р���66�R��Т�6V7F���6�74��S�'&V�F�fR&r�v��FR��b�C���#B"7G��S׷����FW������F�b6�74��S�&6��F��W"ׂ�WF���B���r�'��#����F���� ���F��׷��6�G�����#�Тv���T��f�Ws׷��6�G������Тf�Ww�'C׷���6S�G'VR�Т6�74��S�&�"�FW�B�6V�FW"FW�B�'��f��B�W�G&&��BFW�B�f�&Vw&�V�B6ӧFW�B�7�� ���*��h��)N��@�����F����#��F�b6�74��S�&w&�Bw&�B�6��2�v�26Ӧw&�B�6��2�"#��FF�66�T�FV�2�����FV�����������F����F�`��W�׶�Т��F��׷��6�G�������Тv���T��f�Ws׷��6�G������Тf�Ww�'C׷���6S�G'VR�ТG&�6�F���׷�FV������b�Т6�74��S�&f�W��FV�2�6V�FW"v�2&�V�FVB׆�&r�w&��S��B��2 ���6�V6�6�74��S�&��Br�Bf�W��6�&���FW�B�&��'�"���7�6�74��S�'FW�B�6�f��B��VF�V�FW�B�f�&Vw&�V�B#綗FV����7������F����F�c���Т��F�c���F�c���6V7F���ࠢ��&�6��r��Т�6V7F���6�74��S�'&V�F�fR&r�w&��S��b�C���#B"7G��S׷����FW������F�b6�74��S�&6��F��W"ׂ�WF���B#����F���� ���F��׷��6�G�����#�Тv���T��f�Ws׷��6�G������Тf�Ww�'C׷���6S�G'VR�Т6�74��S�&�"�FW�B�6V�FW"FW�B�'��f��B�W�G&&��BFW�B�f�&Vw&�V�B6ӧFW�B�7�� ��ɩN����X��+@�����F����#��F�b6�74��S�&w&�Bv�b6Ӧw&�B�6��2�2���r�7��ׂ�WF�#��FF�&�6��uF�W'2����F�W"����������F����F�`��W�׶�Т��F��׷��6�G�����#�Тv���T��f�Ws׷��6�G������Тf�Ww�'C׷���6S�G'VR�ТG&�6�F���׷�FV�������Т6�74��S׶&�V�FVB�'��&�&FW"�bFW�B�6V�FW"G�F�W"憖v�Ɩv�B�&&�&FW"�&��'�&r�&��'��R6�F�r��r"�&&�&FW"�w&��#&r�v��FR'�Т��7�6�74��S׶��Ɩ�R�&��6�&�V�FVB�gV����2��FW�Bׇ2f��B�&��BG�F�W"憖v�Ɩv�B�&&r�&��'�FW�B�v��FR"�&&r�w&��FW�B�w&��s'����F�W"�&FvWТ��7���6�74��S�&�B�BFW�B�'��f��B�W�G&&��BFW�B�f�&Vw&�V�B#�F�W"�&�6W�����6�74��S�&�B�"FW�Bׇ2FW�B��WFVB�f�&Vw&�V�B#�F�W"���FW��������F����F�c���Т��F�c���F�c���6V7F���ࠢ��5D��Т�6V7F���6�74��S�'&V�F�fR&r�&��'���b�C���#"7G��S׷����FW������F�b6�74��S�&6��F��W"ׂ�WF���BFW�B�6V�FW"#����F���� ���F��׷��6�G�����#�Тv���T��f�Ws׷��6�G������Тf�Ww�'C׷���6S�G'VR�Т6�74��S�&�"�2FW�B�'��f��B�W�G&&��BFW�B�v��FR6ӧFW�B�7�� ���x����	N����N�8��*���	�����K�ɩ@�����F����#��6�74��S�&�"ӂFW�B�v��FR�#��NٙB����B˛N˛NɊN�j��κ��N���Y��(��ˎ�َ�Y��K�ɩC����F�b6�74��S�&f�W�f�W��6���FV�2�6V�FW"�W7F�g��6V�FW"v�B6Ӧf�W��&�r#����&Vc�'FVã3�c3��S �6�74��S�&��Ɩ�R�f�W��FV�2�6V�FW"v�"&�V�FVB�gV��&r�v��FR�ӂ��BFW�B�6�f��B�&��BFW�B�&��'�6�F�r��fW#�&r�v��FR�G&�6�F��������fW#�66�R�R ������R6�74��S�&��Br�B"��3�c3��S �������&Vc�&�GG3���b����6��������w�B�6�B �F&vWC�%�&�� �&V��&���V�W"��&VfW'&W" �6�74��S�&��Ɩ�R�f�W��FV�2�6V�FW"v�"&�V�FVB�gV��&�&FW"&�&FW"�v��FR�C&r�v��FR�R�ӂ��BFW�B�6�f��B�&��BFW�B�v��FR��fW#�&r�v��FR�#RG&�6�F��������fW#�66�R�R ����W76vT6�&6�R6�74��S�&��Br�B"��˛N˛NɊN�j�ˎ�ـ������F�c���F�c���6V7F�����������������
