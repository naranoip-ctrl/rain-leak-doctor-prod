"use client";

import * as React from "react";
import s from "./ApprovedLanding.module.css";

/**
 * Approved mobile design v3 converted to reusable React sections.
 * No requests, analytics SDKs, environment variables, or application data access here.
 * Use existing project URLs and analytics callbacks via props.
 * Original user-provided survey photos are served unchanged from public/.
 */
export type ContactTarget = {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
export type ContactConfig = {
  line: ContactTarget;
  phone: ContactTarget;
  photo?: ContactTarget;
};
export type LandingProps = { contact: ContactConfig };
export type CasesProps = LandingProps & { existingCases: React.ReactNode };

type SurveyImage = { src: string; label: string; alt: string; width: number; height: number; caption: string };
const ASSETS = "/images/approved-rain-leak-v3/";
const KITA_IMAGES: readonly SurveyImage[] = [
  {src: ASSETS+"kita-exterior-visible.jpg", label:"通常写真", alt:"大阪市北区の外壁の通常写真。窓と室外機のある外壁面", width:2048,height:1536, caption:"外壁の状態"},
  {src: ASSETS+"kita-exterior-thermal.jpg", label:"赤外線画像", alt:"大阪市北区の外壁の赤外線画像。原画像の赤枠・温度分布を保持", width:640,height:512, caption:"温度分布"}
];
const INDOOR_IMAGES: readonly SurveyImage[] = [
  {src: ASSETS+"visible-ceiling-survey.jpg", label:"通常写真", alt:"室内の天井と壁の取り合い付近を撮影した通常写真", width:640,height:480, caption:"通常写真｜天井・壁の状態を確認"},
  {src: ASSETS+"thermal-ceiling-survey.jpg", label:"赤外線画像", alt:"同じ調査箇所の赤外線画像。天井と壁の取り合い付近の温度分布", width:640,height:480, caption:"赤外線画像｜周囲と異なる温度分布を確認"}
];

function ContactButton({kind,contact}:{kind:"line"|"phone";contact:ContactConfig}) {
  const target=contact[kind];
  const isLine=kind==="line";
  return <a href={target.href} onClick={target.onClick}
    target={isLine?"_blank":undefined} rel={isLine?"noopener noreferrer":undefined}
    className={[s.button,isLine?s["button-primary"]:s["button-secondary"]].join(" ")}>
    <svg className={s.icon} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={isLine?"M21 11a8.7 8.7 0 0 1-9 8.5 10 10 0 0 1-3-.5l-6 2 1.8-5A8.2 8.2 0 0 1 3 11a9 9 0 0 1 18 0Z":"M7.5 3H4.6C3.7 3 3 3.7 3 4.6A16.4 16.4 0 0 0 19.4 21c.9 0 1.6-.7 1.6-1.6v-2.9l-4.4-1.8-2 2a14 14 0 0 1-7.3-7.3l2-2L7.5 3Z"}/>
    </svg>
    <span className={s.label}>{isLine?"LINEで相談する":"電話で相談する"}</span>
    {isLine&&<svg className={[s.icon,s.arrow].join(" ")} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>}
  </a>;
}

/** Native dialog gives keyboard focus containment; Escape and explicit close both restore focus. */
class SurveyGallery extends React.Component<
 {idPrefix:string;mode:"pair"|"tabs";items:readonly SurveyImage[]},
 {active:number;zoom:number;failed:Record<string,boolean>}
> {
 state={active:this.props.mode==="tabs"?1:0,zoom:0,failed:{} as Record<string,boolean>};
 private dialog:HTMLDialogElement|null=null;
 private trigger:HTMLElement|null=null;
 private tabButtons:(HTMLButtonElement|null)[]=[];
 private previousOverflow:string|null=null;
 private close=()=>{this.dialog?.close();};
 private restore=()=>{
   if(this.previousOverflow!==null){document.body.style.overflow=this.previousOverflow;this.previousOverflow=null;}
   if(this.trigger?.isConnected)this.trigger.focus({preventScroll:true});
 };
 componentWillUnmount(){this.restore();}
 private open=(index:number,trigger:HTMLElement)=>{
   this.trigger=trigger;
   this.setState({zoom:index},()=>{
     if(this.dialog&&!this.dialog.open){
       this.previousOverflow=document.body.style.overflow;
       document.body.style.overflow="hidden";
       this.dialog.showModal();
     }
   });
 };
 private select=(index:number,focus=false)=>this.setState({active:index},()=>{
   if(focus)this.tabButtons[index]?.focus();
 });
 private onKey=(event:React.KeyboardEvent<HTMLButtonElement>,index:number)=>{
   const n=this.props.items.length;
   const next=event.key==="Home"?0:event.key==="End"?n-1:event.key==="ArrowRight"?(index+1)%n:event.key==="ArrowLeft"?(index+n-1)%n:null;
   if(next!==null){event.preventDefault();this.select(next,true);}
 };
 private image=(item:SurveyImage)=>this.state.failed[item.src]
   ? <p className={s["image-load-error"]}>画像を読み込めませんでした。</p>
   : <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async"
       onError={()=>this.setState(({failed})=>({failed:{...failed,[item.src]:true}}))}/>;
 render(){
   const {items,mode,idPrefix}=this.props;
   const zoom=items[this.state.zoom];
   return <div>
     {mode==="pair"?<div className={s["exterior-comparison"]} aria-label="大阪市北区の外壁：通常写真と赤外線画像">
       {items.map((item,index)=><figure key={item.src}>
         <button type="button" className={s["case-image-button"]} aria-label={item.label+"を拡大"}
           onClick={event=>this.open(index,event.currentTarget)}>
           {this.image(item)}<span className={s["zoom-hint"]} aria-hidden="true">＋</span>
         </button>
         <figcaption><span className={s["image-label"]}>{item.label}</span><span className={s["image-sub-label"]}>{item.caption}</span></figcaption>
       </figure>)}
     </div>:<div>
       <div className={s["compare-tabs"]} role="tablist" aria-label="通常写真と赤外線画像の切替">
         {items.map((item,index)=><button type="button" key={item.src}
           ref={node=>{this.tabButtons[index]=node;}}
           id={idPrefix+"-tab-"+index} aria-controls={idPrefix+"-panel-"+index}
           role="tab" aria-selected={this.state.active===index} tabIndex={this.state.active===index?0:-1}
           className={[s["compare-tab"],this.state.active===index?s["is-active"]:""].join(" ")}
           onClick={()=>this.select(index)} onKeyDown={event=>this.onKey(event,index)}>{item.label}</button>)}
       </div>
       <div className={s["compare-stage"]}>
         {items.map((item,index)=><figure key={item.src} className={s["compare-panel"]}
           role="tabpanel" id={idPrefix+"-panel-"+index} aria-labelledby={idPrefix+"-tab-"+index}
           hidden={this.state.active!==index} tabIndex={0}>
           {this.image(item)}<figcaption>{item.caption}</figcaption>
         </figure>)}
       </div>
     </div>}
     <dialog ref={node=>{this.dialog=node;}} className={s["image-dialog"]}
       aria-labelledby={idPrefix+"-zoom-caption"} onClose={this.restore}
       onClick={event=>{
         if(event.target!==event.currentTarget)return;
         const r=event.currentTarget.getBoundingClientRect();
         if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)this.close();
       }}>
       <div className={s["image-dialog-head"]}>
         <p id={idPrefix+"-zoom-caption"}>{zoom.alt}</p>
         <button type="button" className={s["image-dialog-close"]} aria-label="写真の拡大表示を閉じる" onClick={this.close}>×</button>
       </div>
       {this.image(zoom)}
       <p className={s["image-dialog-note"]}>通常写真と赤外線画像は、補修前後を示すものではありません。赤外線画像の配色・赤枠はご提供の原画像のままです。</p>
     </dialog>
   </div>;
 }
}

export function ApprovedBrandMark(){return <span className={s.root}>
  <a className={s.brand} href="/" aria-label="雨漏りドクター ホームへ">
    <svg className={s["brand-mark"]} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10 12 2l9 8M5 9v12h14V9M9 21v-7h6v7"/></svg>
    <span>雨漏りドクター</span>
  </a>
</span>;}

export function ApprovedHero({contact}:LandingProps){
 return <div className={s.root} data-approved-section="ApprovedHero">
<section aria-labelledby="hero-title" className={s["hero"]}><div className={[s["wrap"], s["hero-grid"]].join(" ")}><div className={s["hero-heading"]}><p className={s["kicker"]}>{"原因不明・再発する雨漏りのご相談に"}</p><h1 id="hero-title">{"その雨漏り、"}<br /><span>{"原因から見極める。"}</span></h1><p className={s["hero-sub"]}>{"目視・赤外線・散水で、原因の候補を検証。"}</p></div><figure className={s["scene"]}><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-1.png" alt="住宅を確認する調査員のイメージ。実際の社員・施工事例ではありません。" width="1000" height="936" decoding="async" loading="eager" /><div className={s["scene-label"]}>{"原因特定調査"}</div><div className={s["scene-float"]}><div className={s["float-images"]}><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-2.png" alt="天井のシミのイメージ。実際の調査結果ではありません。" width="480" height="270" decoding="async" loading="lazy" /><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-3.png" alt="赤外線による温度分布のイメージ。原因特定の証拠ではありません。" width="480" height="250" decoding="async" loading="lazy" /></div><p>{"見える症状、その奥まで。"}<br /><span>{"画像は調査のイメージです"}</span></p></div><figcaption className={s["scene-caption"]}>{"調査イメージ"}</figcaption></figure><div className={s["hero-offer"]}><div className={s["pricing"]} id="hero-pricing"><div className={s["pricing-top"]}><span>{"原因特定調査"}<span style={{"fontWeight": 500}}>{"〈報告書付き〉"}</span></span><span className={s["price-tax"]}>{"すべて税込"}</span></div><div className={s["price-columns"]}><div className={s["price-col"]}><p className={s["price-title"]}>{"木造戸建て・小規模建物"}<small>{"小規模S造含む／RC・SRC除く"}</small></p><p className={s["price-number"]}>{"55,000"}<small>{"円〜"}</small></p></div><div className={s["price-col"]}><p className={s["price-title"]}>{"RC・SRC・中型建物"}<small>{"対象範囲を確認して事前見積"}</small></p><p className={s["price-number"]}>{"150,000"}<small>{"円〜"}</small></p></div></div><div className={s["large-price"]}><span>{"大型建物・8階建て以上"}</span><b>{"別途見積"}</b></div></div><div className={s["guarantee"]}><span>{"特定できなければ"}<br />{"基本調査料"}</span><strong>{"0"}<small>{"円"}</small></strong></div><p className={s["essential-note"]}>{"※事前合意したロープ・仮設・部分開口などの作業費は、特定の可否にかかわらず発生する場合があります。結果別のお支払総額は契約前にご提示します。"}</p></div><div className={s["hero-conversion"]}><div className={s["actions"]}><ContactButton kind="line" contact={contact} /><ContactButton kind="phone" contact={contact} /></div><div className={s["hero-proof"]}><span><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"></path></svg>{"工事は別契約"}</span><span><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"></path></svg>{"調査のみも対応"}</span><span><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z"></path><circle cx="12" cy="10" r="2"></circle></svg>{"関西対応"}</span></div></div></div><div className={s["photo-entry"]}>{contact.photo&&<a className={s["photo-link"]} href={contact.photo.href} onClick={contact.photo.onClick}>写真で無料相談する</a>}</div></section>
</div>;
}

export function ApprovedCases({contact,existingCases}:CasesProps){
 return <div className={s.root} data-approved-section="ApprovedCases">
<section aria-labelledby="cases-title" className={[s["section"], s["cases"]].join(" ")} id="cases"><div className={s["wrap"]}><div className={s["cases-heading"]}><div><p className={s["section-kicker"]}><span>{"01"}</span>{"施工・調査事例"}</p><h2 id="cases-title">{"写真で見る、"}<br />{"調査と施工の現場。"}</h2><p className={s["section-lead"]}>{"実際の調査画像と、これまでの施工事例をご紹介します。"}</p></div><a className={s["case-jump"]} href="#existing-cases">{"これまでの施工事例へ "}<span aria-hidden="true">{"↓"}</span></a></div><article aria-labelledby="kita-case-title" className={[s["featured-case"], s["exterior-case"]].join(" ")} id="case-kita-thermal"><div className={s["exterior-heading"]}><div className={s["case-image-topline"]}><span className={s["case-type"]}>{"調査事例"}</span><span className={s["case-place"]}>{"大阪市北区"}</span></div><h3 id="kita-case-title">{"赤外線調査で"}<em>{"外壁の変化"}</em>{"を"}<br className={s["kita-mobile-break"]} />{"確認した事例"}</h3></div><SurveyGallery idPrefix="ald-kita" mode="pair" items={KITA_IMAGES} /><div className={s["exterior-body"]}><p className={s["pair-hint"]}>{"写真をタップすると、原画像を拡大して確認できます。"}</p><p className={s["case-description"]}>{"通常写真と赤外線画像を比較し、外壁面の一部に周囲と異なる温度分布を確認しました。"}</p><div className={s["exterior-price"]}><span>{"この事例の調査費"}</span><div><strong>{"150,000"}<small>{"円"}</small></strong><span className={s["case-tax"]}>{"（税込）"}</span></div></div><p className={s["case-evidence-note"]}>{"※温度分布の確認事例です。浸入口や修繕結果を示すものではありません。"}</p><p className={s["case-price-note"]}>{"※調査費の事例であり、修繕工事費ではありません。費用は対象範囲や建物条件により異なります。"}</p></div></article><div className={s["indoor-case-heading"]}><h3>{"室内の赤外線調査も"}</h3><span>{"通常写真と比較して確認"}</span></div><article aria-labelledby="thermal-case-title" className={s["featured-case"]} id="thermal-case"><div className={s["featured-visual"]}><div className={s["case-image-topline"]}><span className={s["case-type"]}>{"調査事例"}</span><span>{"実際の調査画像"}</span></div><SurveyGallery idPrefix="ald-indoor" mode="tabs" items={INDOOR_IMAGES} /><p className={s["compare-hint"]}>{"上のボタンで写真を切り替えて比較できます。"}</p></div><div className={s["featured-copy"]}><p className={s["case-eyebrow"]}>{"赤外線サーモグラフィ調査"}</p><h3 id="thermal-case-title">{"目では分かりにくい変化を、"}<br /><em>{"赤外線で確認。"}</em></h3><p className={s["case-description"]}>{"通常写真と赤外線画像を比較し、天井と壁の取り合い付近に、周囲と異なる温度分布を確認した調査事例です。"}</p><div className={s["case-price"]}><div><span>{"この事例の調査費"}</span><strong>{"55,000"}<small>{"円"}</small></strong></div><span className={s["case-tax"]}>{"税込"}</span></div><dl className={s["case-facts"]}><div><dt>{"確認した箇所"}</dt><dd>{"天井・壁の取り合い付近"}</dd></div><div><dt>{"掲載した記録"}</dt><dd>{"通常写真・赤外線画像"}</dd></div></dl><p className={s["case-evidence-note"]}>{"※写真は補修前後の比較ではありません。赤外線の温度差だけで、雨漏りの原因を断定するものではありません。"}</p><p className={s["case-price-note"]}>{"※55,000円はこの調査事例の費用です。修繕工事費は含みません。調査範囲・建物条件により料金は異なります。"}</p></div></article><div className={s["existing-header"]} id="existing-cases"><h3>{"これまでの施工事例"}</h3><span>{"屋根・外壁の修繕"}</span></div><div className={s["existing-slot"]}>{existingCases}</div><div className={s["cases-cta"]}><p>{"気になる場所を、まずはご相談ください。"}</p><ContactButton kind="line" contact={contact} /></div></div></section>
</div>;
}

export function ApprovedProblems(){
 return <div className={s.root} data-approved-section="ApprovedProblems">
<section aria-labelledby="problems-title" className={s["section"]} id="problems"><div className={s["wrap"]}><p className={s["section-kicker"]}><span>{"02"}</span>{" ご相談いただける症状"}</p><h2 id="problems-title">{"こんな状態で、"}<br />{"困っていませんか？"}</h2><div className={s["problems"]}><article className={s["problem-card"]}><div className={s["problem-photo"]}><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-4.png" alt="天井のシミのイメージ。実際の事例ではありません。" width="480" height="279" decoding="async" loading="lazy" /><span className={s["photo-note"]}>{"イメージ"}</span></div><div className={s["problem-copy"]}><span className={s["problem-eyebrow"]}><b>{"01"}</b>{"原因不明"}</span><h3>{"調べても、"}<br />{"原因が分からない。"}</h3><p>{"これまでの調査内容を確認し、原因の候補を検証します。"}</p></div></article><article className={s["problem-card"]}><div className={s["problem-photo"]}><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/recurring-ceiling-leak.png" alt="補修跡のある天井に再び水染みが出ているイメージ。実際の事例写真ではありません。" width="960" height="930" decoding="async" loading="lazy" /><span className={s["photo-note"]}>{"イメージ"}</span></div><div className={s["problem-copy"]}><span className={s["problem-eyebrow"]}><b>{"02"}</b>{"再発"}</span><h3>{"直したのに、"}<br />{"また漏れている。"}</h3><p>{"補修履歴も踏まえて、対象症状と浸入経路を調べます。"}</p></div></article><article className={s["problem-card"]}><div className={s["problem-photo"]}><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-6.png" alt="住宅外装のイメージ。ロープ作業の実施事例ではありません。" width="480" height="627" decoding="async" loading="lazy" /><span className={s["photo-note"]}>{"イメージ"}</span></div><div className={s["problem-copy"]}><span className={s["problem-eyebrow"]}><b>{"03"}</b>{"アクセス困難"}</span><h3>{"高所や狭所で、"}<br />{"確認できない。"}</h3><p>{"建物の条件に合わせ、安全に調査できる方法を検討します。"}</p></div></article></div><p className={s["problem-footer"]}><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M21 11a8.7 8.7 0 0 1-9 8.5 10 10 0 0 1-3-.5l-6 2 1.8-5A8.2 8.2 0 0 1 3 11a9 9 0 0 1 18 0Z"></path></svg>{"これまでの対応内容から、お聞かせください。"}</p></div></section>
</div>;
}

export function ApprovedProcess({contact}:LandingProps){
 return <div className={s.root} data-approved-section="ApprovedProcess">
<section aria-labelledby="process-title" className={[s["section"], s["process"]].join(" ")} id="process"><div className={[s["wrap"], s["process-grid"]].join(" ")}><div className={s["process-left"]}><p className={s["section-kicker"]}><span>{"03"}</span>{" 調査から報告まで"}</p><h2 id="process-title">{"調べた内容を、"}<br />{"次の判断につなげる。"}</h2><p className={s["section-lead"]}>{"原因の候補を検証し、写真とともに報告。"}<br />{"確認できたことと、未確認のことを分けます。"}</p><div className={s["inspection-visual"]}><figure className={s["inspection-tile"]}><div className={s["photo-area"]}><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-2.png" alt="天井のシミのイメージ。実際の調査結果ではありません。" width="480" height="270" decoding="async" loading="lazy" /></div><figcaption><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>{"症状を確認"}</figcaption></figure><figure className={s["inspection-tile"]}><div className={s["photo-area"]}><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-3.png" alt="赤外線による温度分布のイメージ。原因特定の証拠ではありません。" width="480" height="250" decoding="async" loading="lazy" /></div><figcaption><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><rect height="15" rx="3" width="20" x="2" y="6"></rect><path d="m7 6 2-3h6l2 3"></path><circle cx="12" cy="13" r="4"></circle></svg>{"温度分布を確認"}</figcaption></figure></div><p className={s["visual-note"]}>{"※画像はイメージ。赤外線の温度差だけで原因を特定せず、対象に応じて散水などで検証します。"}</p><div className={s["steps"]}><div className={s["step"]}><div className={s["step-icon"]}><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg></div><p className={s["step-label"]}><small>{"01"}</small>{"症状・履歴を確認"}</p></div><div className={s["step"]}><div className={s["step-icon"]}><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"></path></svg></div><p className={s["step-label"]}><small>{"02"}</small>{"原因の候補を検証"}</p></div><div className={s["step"]}><div className={s["step-icon"]}><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6"></path></svg></div><p className={s["step-label"]}><small>{"03"}</small>{"写真付きで報告"}</p></div></div></div><div className={s["process-right"]}><article className={s["report"]}><div className={s["report-top"]}><svg aria-hidden="true" className={s["icon"]} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8M8 16h6"></path></svg><h3>{"お渡しするのは、判断の材料。"}</h3></div><p className={s["sample-note"]}>{"報告書の見本／実案件ではありません"}</p><div className={s["report-sheet"]}><div className={s["sheet-head"]}><b>{"原因特定調査 報告書"}</b><span>{"見本 S-01"}</span></div><div className={s["sheet-images"]}><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-2.png" alt="天井のシミのイメージ。実際の調査結果ではありません。" width="480" height="270" decoding="async" loading="lazy" /><img className={s["photo-window"]} src="/images/approved-rain-leak-v3/illustration-3.png" alt="赤外線による温度分布のイメージ。原因特定の証拠ではありません。" width="480" height="250" decoding="async" loading="lazy" /></div><div className={s["sheet-lines"]}><span>{"対象症状・調査位置"}</span><span>{"試験条件・写真"}</span><span>{"判定とその根拠"}</span><span>{"未確認事項"}</span></div></div><p className={s["report-summary"]}>{"確認・推定・未確認を分けて記録。"}<br />{"補修を検討するときの説明にも。"}</p><div className={s["report-bottom"]}><span>{"写真付き"}</span><span>{"症状番号で整理"}</span><span>{"調査のみも対応"}</span></div></article><p className={s["process-end"]}>{"工事は別契約。"}<span>{"まずは、調査だけのご依頼も可能です。"}</span></p><ContactButton kind="line" contact={contact} /><div className={s["payment-brief"]}><strong>{"一部特定の場合も、料金は事前に確認。"}</strong>{"すべて特定・一部特定・未特定。それぞれのお支払総額を、契約前に合意します。結果が出た後に、当社の判断だけで請求割合を変更しません。"}</div></div></div></section>
</div>;
}

