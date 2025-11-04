import { Course, LessonProgress } from './types';

const asesmenAwalQuiz = {
  id: 'quiz-awal-1',
  title: 'Kuis Asesmen Awal',
  questions: [
    {
      id: 'q1-awal',
      type: 'multiple-choice' as const,
      text: 'Manakah di bawah ini yang BUKAN merupakan ciri makhluk hidup?',
      options: [
        { id: 'opt1', text: 'Bernapas' },
        { id: 'opt2', text: 'Bergerak' },
        { id: 'opt3', text: 'Memerlukan nutrisi' },
        { id: 'opt4', text: 'Tidak dapat berubah bentuk' },
      ],
      correctOptionId: 'opt4',
    },
    {
      id: 'q2-awal',
      type: 'multiple-select' as const,
      text: 'Pilih SEMUA ciri-ciri yang dimiliki oleh makhluk hidup.',
      options: [
        { id: 'opt1', text: 'Tumbuh dan berkembang' },
        { id: 'opt2', text: 'Peka terhadap rangsang (iritabilitas)' },
        { id: 'opt3', text: 'Memiliki suhu tetap' },
        { id: 'opt4', text: 'Berkembang biak (reproduksi)' },
      ],
      correctOptionIds: ['opt1', 'opt2', 'opt4'],
    }
  ]
};

const subMateri1Quiz = {
    id: 'quiz-submateri-1',
    title: 'Kuis: Makhluk Hidup vs Benda Mati',
    questions: [
        {
            id: 'q1-sm1',
            type: 'multiple-choice' as const,
            text: 'Berdasarkan video, apa perbedaan utama antara robot dan manusia dalam konteks ciri kehidupan?',
            options: [
                { id: 'opt1', text: 'Robot dapat bergerak, manusia tidak' },
                { id: 'opt2', text: 'Manusia bernapas, sedangkan robot tidak' },
                { id: 'opt3', text: 'Robot memerlukan listrik, manusia memerlukan air' },
                { id: 'opt4', text: 'Keduanya sama-sama makhluk hidup' },
            ],
            correctOptionId: 'opt2',
        }
    ]
};

const asesmenAkhirQuiz = {
  id: 'quiz-akhir-1',
  title: 'Kuis Asesmen Akhir',
  questions: [
    {
      id: 'q1-akhir',
      type: 'multiple-choice' as const,
      text: 'Proses penyesuaian diri makhluk hidup terhadap lingkungannya disebut...',
      options: [
        { id: 'opt1', text: 'Adaptasi' },
        { id: 'opt2', text: 'Evolusi' },
        { id: 'opt3', text: 'Iritabilitas' },
        { id: 'opt4', text: 'Metabolisme' },
      ],
      correctOptionId: 'opt1',
    },
    {
      id: 'q2-akhir',
      type: 'matching' as const,
      text: 'Pasangkan istilah berikut dengan definisi yang tepat.',
      matchPrompts: [
          { id: 'prompt1', text: 'Metabolisme' },
          { id: 'prompt2', text: 'Reproduksi' },
          { id: 'prompt3', text: 'Ekskresi' },
      ],
      matchOptions: [
          { id: 'match1', text: 'Proses pengeluaran zat sisa' },
          { id: 'match2', text: 'Kemampuan menghasilkan keturunan' },
          { id: 'match3', text: 'Keseluruhan reaksi kimia dalam tubuh' },
      ],
      correctMatches: {
          'prompt1': 'match3',
          'prompt2': 'match2',
          'prompt3': 'match1',
      }
    }
  ]
};

export const DUMMY_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Ilmu Pengetahuan Alam - Kelas 7',
    description: 'Mempelajari dasar-dasar IPA untuk siswa kelas 7, mencakup klasifikasi makhluk hidup, ekosistem, dan zat.',
    modules: [
      {
        id: 'module-1',
        title: 'Klasifikasi Makhluk Hidup',
        lessons: [
          {
            id: 'lesson-1',
            title: 'Ciri-ciri dan Klasifikasi Makhluk Hidup',
            // Sesi 1
            apersepsi: 'Selamat datang di pelajaran pertama! Sebelum kita mulai, mari kita pikirkan sejenak. Apa saja yang membedakan antara kucing peliharaanmu dengan batu di taman? Keduanya adalah benda, tetapi mengapa yang satu kita sebut "hidup" dan yang lainnya "mati"? Di sesi ini, kita akan menjelajahi ciri-ciri dasar yang mendefinisikan kehidupan.',
            asesmenAwal: asesmenAwalQuiz,
            // Sesi 2
            kegiatanInti: [
                {
                    id: 'sub-1',
                    title: 'Membedakan Makhluk Hidup dan Benda Mati',
                    videoUrl: 'https://www.youtube.com/embed/sY5-y_s4qgE', // Changed video to one that allows embedding
                    quiz: subMateri1Quiz,
                },
                {
                    id: 'sub-2',
                    title: 'Hierarki Klasifikasi (Takson)',
                    videoUrl: 'https://www.youtube.com/embed/A22o_p6_T8k', // Placeholder video
                    quiz: {
                        id: 'quiz-submateri-2',
                        title: 'Kuis: Hierarki Takson',
                        questions: [
                            {
                                id: 'q1-sm2',
                                type: 'multiple-choice' as const,
                                text: 'Urutan takson dari yang paling tinggi ke paling rendah yang benar adalah...',
                                options: [
                                    { id: 'opt1', text: 'Kingdom - Filum - Kelas - Ordo - Famili - Genus - Spesies' },
                                    { id: 'opt2', text: 'Spesies - Genus - Famili - Ordo - Kelas - Filum - Kingdom' },
                                    { id: 'opt3', text: 'Kingdom - Ordo - Kelas - Filum - Famili - Genus - Spesies' },
                                    { id: 'opt4', text: 'Filum - Kingdom - Kelas - Famili - Ordo - Genus - Spesies' },
                                ],
                                correctOptionId: 'opt1',
                            }
                        ]
                    }
                }
            ],
            // Sesi 3
            asesmenAkhir: asesmenAkhirQuiz,
            // Sesi 4
            penutup: {
              prompt: 'Setelah mempelajari materi hari ini, coba tuliskan refleksi singkat. Apa hal paling menarik yang kamu pelajari? Adakah konsep yang masih membingungkan? Bagaimana pengetahuan ini bisa kamu terapkan dalam kehidupan sehari-hari?',
            },
          },
          {
            id: 'lesson-2',
            title: 'Keanekaragaman Hayati dan Konservasi',
            apersepsi: 'Pelajaran ini akan membahas tentang keanekaragaman hayati.',
            kegiatanInti: [],
            asesmenAkhir: { id: 'quiz-akhir-2', title: 'Kuis', questions: []}
            ,
            penutup: { prompt: 'Refleksi untuk pelajaran 2.'}
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Ekosistem',
        lessons: [
            {
                id: 'lesson-3',
                title: 'Komponen Ekosistem',
                apersepsi: 'Pelajaran ini akan membahas tentang komponen ekosistem.',
                kegiatanInti: [],
                asesmenAkhir: { id: 'quiz-akhir-3', title: 'Kuis', questions: []},
                penutup: { prompt: 'Refleksi untuk pelajaran 3.'}
            }
        ]
      }
    ]
  }
];

export const getInitialProgress = (lessonId: string): LessonProgress => ({
    lessonId,
    completedApersepsi: false,
    completedAsesmenAwal: false,
    asesmenAwalScore: null,
    completedKegiatanInti: 0,
    completedAsesmenAkhir: false,
    completedPenutup: false,
    quizAttempts: {},
    reflectionText: '',
    finalScore: null,
});