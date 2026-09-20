(()=>{'use strict';
const CASES={
  '/neom.html':{
    en:{
      kicker:'PROJECT CASE STUDY',title:'NEOM — multi-building BIM portfolio',
      summary:'A multi-building BIM portfolio structured by building and sub-project so reviewers can move from project context to published model and drawing evidence quickly.',
      facts:[['Verified role','BIM Modeler & Detailer'],['Published scope','Dining Facility · Sports Center · Professional Village'],['Workflow','Organized by building and sub-project'],['Deliverables','BIM models · Documentation · Image galleries']],
      story:[
        ['01','What is shown','Architectural BIM modeling and documentation published for the Dining Facility, Sports Center and Professional Village building packages.'],
        ['02','How it is organized','Each building is separated into its own review path so the portfolio does not mix unrelated model and drawing evidence.'],
        ['03','Technical evidence','The page exposes project images and building-specific galleries instead of relying on a project logo or high-level description alone.'],
        ['04','What it demonstrates','The published evidence demonstrates experience working with multi-building BIM content and organizing technical material for clear review.']
      ],
      note:'Publication note: this case study describes only the material currently published in this portfolio and does not imply ownership of the full project scope.'
    },
    ar:{
      kicker:'دراسة حالة للمشروع',title:'NEOM — أعمال BIM متعددة المباني',
      summary:'عرض BIM متعدد المباني منظم حسب المبنى والمشروع الفرعي لتسهيل الانتقال من سياق المشروع إلى الأدلة المنشورة من النماذج واللوحات.',
      facts:[['الدور المثبت','مصمم نماذج BIM ومعدّ التفاصيل'],['النطاق المنشور','مبنى المطعم · المركز الرياضي · القرية المهنية'],['طريقة التنظيم','حسب المبنى والمشروع الفرعي'],['المخرجات المنشورة','نماذج BIM · توثيق · معارض صور']],
      story:[
        ['01','المحتوى المعروض','نمذجة وتوثيق BIM معماري منشور لمبنى المطعم والمركز الرياضي وحزم مباني القرية المهنية.'],
        ['02','طريقة التنظيم','فصل كل مبنى في مسار مراجعة مستقل حتى لا تختلط الأدلة الفنية بين الحزم المختلفة.'],
        ['03','الدليل الفني','تعرض الصفحة صور المشروع ومعارض خاصة بالمباني بدلاً من الاعتماد على شعار المشروع أو وصف عام فقط.'],
        ['04','ما الذي يوضحه','توضح المواد المنشورة خبرة في التعامل مع محتوى BIM متعدد المباني وتنظيم المواد الفنية لتسهيل المراجعة.']
      ],
      note:'ملاحظة النشر: تصف دراسة الحالة فقط المواد المنشورة حاليًا في هذا البورتفوليو ولا تعني ملكية كامل نطاق المشروع.'
    }
  },
  '/nupco.html':{
    en:{
      kicker:'PROJECT CASE STUDY',title:'NUPCO — warehouse BIM documentation',
      summary:'A drawing-led BIM case study centered on the published Building 01 Warehouse package and its structured architectural sheet set.',
      facts:[['Verified role','BIM Modeler & Detailer'],['Published scope','Building 01 · Warehouse'],['Workflow','Revit sheet groups · AR-0000 to AR-1700'],['Deliverables','Architectural BIM drawing package']],
      story:[
        ['01','What is shown','The published portfolio scope focuses on Building 01 and the Warehouse architectural BIM drawing set.'],
        ['02','How it is organized','The drawing package is structured by Revit sheet groups and technical drawing ranges for faster navigation.'],
        ['03','Technical evidence','Reviewers can open the Warehouse gallery and inspect the published architectural sheets directly.'],
        ['04','What it demonstrates','The evidence demonstrates experience organizing and presenting a substantial architectural BIM documentation package.']
      ],
      note:'Publication note: only the currently published Building 01 material is described here; unpublished building packages are not represented as completed portfolio evidence.'
    },
    ar:{
      kicker:'دراسة حالة للمشروع',title:'NUPCO — توثيق BIM للمستودع',
      summary:'دراسة حالة تعتمد على اللوحات وتركز على حزمة المبنى 01 للمستودع ومجموعة اللوحات المعمارية المنشورة والمنظمة.',
      facts:[['الدور المثبت','مصمم نماذج BIM ومعدّ التفاصيل'],['النطاق المنشور','المبنى 01 · المستودع'],['طريقة العمل','مجموعات لوحات Revit · AR-0000 إلى AR-1700'],['المخرجات','حزمة لوحات BIM معمارية']],
      story:[
        ['01','المحتوى المعروض','يركز نطاق البورتفوليو المنشور على المبنى 01 وحزمة لوحات BIM المعمارية للمستودع.'],
        ['02','طريقة التنظيم','تم تنظيم حزمة اللوحات حسب مجموعات لوحات Revit ونطاقات اللوحات الفنية لتسهيل الوصول والمراجعة.'],
        ['03','الدليل الفني','يمكن للمراجع فتح معرض المستودع وفحص اللوحات المعمارية المنشورة مباشرة.'],
        ['04','ما الذي يوضحه','توضح الأدلة خبرة في تنظيم وعرض حزمة كبيرة من توثيق BIM المعماري بصورة قابلة للمراجعة.']
      ],
      note:'ملاحظة النشر: تصف الصفحة فقط مواد المبنى 01 المنشورة حاليًا، ولا تعرض الحزم غير المنشورة كأدلة مكتملة في البورتفوليو.'
    }
  },
  '/zain-industries.html':{
    en:{
      kicker:'PROJECT CASE STUDY',title:'ZAIN INDUSTRIES — industrial BIM documentation',
      summary:'An industrial BIM portfolio organized by facility, separating Warehouse and HCL Tank Farm evidence into focused review paths.',
      facts:[['Verified role','BIM Modeler & Detailer'],['Published scope','Warehouse · HCL Tank Farm'],['Workflow','Facility-based BIM documentation'],['Deliverables','Models · Drawings · Project documentation']],
      story:[
        ['01','What is shown','Published BIM modeling, drawing and documentation evidence for the Warehouse and HCL Tank Farm facilities.'],
        ['02','How it is organized','Each facility has its own card and expandable gallery, keeping industrial project evidence separated and easy to scan.'],
        ['03','Technical evidence','The galleries expose the available project images directly and keep the facility context attached to each set.'],
        ['04','What it demonstrates','The published material demonstrates experience handling BIM documentation across more than one industrial facility type.']
      ],
      note:'Publication note: this case study describes only the material published in this portfolio and does not claim responsibility for the complete industrial project scope.'
    },
    ar:{
      kicker:'دراسة حالة للمشروع',title:'ZAIN INDUSTRIES — توثيق BIM صناعي',
      summary:'بورتفوليو BIM صناعي منظم حسب المنشأة، يفصل أدلة المستودع ومنطقة خزانات HCL في مسارات مراجعة واضحة.',
      facts:[['الدور المثبت','مصمم نماذج BIM ومعدّ التفاصيل'],['النطاق المنشور','المستودع · منطقة خزانات HCL'],['طريقة العمل','توثيق BIM حسب المنشأة'],['المخرجات','نماذج · لوحات · توثيق مشروع']],
      story:[
        ['01','المحتوى المعروض','أدلة منشورة لأعمال نمذجة BIM واللوحات والتوثيق للمستودع ومنطقة خزانات HCL.'],
        ['02','طريقة التنظيم','لكل منشأة بطاقة ومعرض قابل للتوسعة، مما يحافظ على فصل الأدلة الصناعية وسهولة استعراضها.'],
        ['03','الدليل الفني','تعرض المعارض صور المشروع المتاحة مباشرة مع إبقاء سياق المنشأة مرتبطًا بكل مجموعة.'],
        ['04','ما الذي يوضحه','توضح المواد المنشورة خبرة في التعامل مع توثيق BIM لأكثر من نوع من المنشآت الصناعية.']
      ],
      note:'ملاحظة النشر: تصف دراسة الحالة فقط المواد المنشورة في هذا البورتفوليو ولا تدعي مسؤولية كامل نطاق المشروع الصناعي.'
    }
  }
};
const key=location.pathname.endsWith('/')?'/index.html':location.pathname.slice(location.pathname.lastIndexOf('/'));
const data=CASES[key];
if(!data)return;
const lang=()=>document.documentElement.lang==='ar'?'ar':'en';
function render(){
  const hero=document.querySelector('main .hero');
  if(!hero)return;
  let section=document.querySelector('.portfolio-case-study-pro');
  if(!section){
    section=document.createElement('section');
    section.className='dynamic-case-study portfolio-case-study-pro';
    hero.after(section);
  }
  const d=data[lang()];
  section.innerHTML=
    '<div class="dynamic-case-head"><div><span class="dynamic-case-kicker">'+d.kicker+'</span><h2>'+d.title+'</h2></div><p>'+d.summary+'</p></div>'+
    '<div class="dynamic-case-facts">'+d.facts.map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join('')+'</div>'+
    '<div class="dynamic-case-story">'+d.story.map(x=>'<article><span class="dynamic-case-step">'+x[0]+'</span><h3>'+x[1]+'</h3><p>'+x[2]+'</p></article>').join('')+'</div>'+
    '<p class="case-study-note">'+d.note+'</p>';
}
function init(){
  render();
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  document.addEventListener('portfolio:language',render);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();