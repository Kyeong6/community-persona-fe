import { useState } from 'react';
import { Calendar as CalendarIcon, Sparkles, Star, ChevronDown, Copy, Edit, ArrowLeft, Heart, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Calendar } from './components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Textarea } from './components/ui/textarea';
import { Separator } from './components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible';
import { toast } from 'sonner@2.0.3';

type EmphasisType = '쿠폰' | '이벤트' | '특정 키워드' | '기타';

interface EmphasisItem {
  type: EmphasisType;
  content: string;
}

interface GeneratedContent {
  id: number;
  text: string;
  tone: string;
}

export default function App() {
  const [showResults, setShowResults] = useState(false);
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  
  const [productName, setProductName] = useState('나이키 에어맥스 270');
  const [price, setPrice] = useState('89,000원');
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 0, 20));
  const [endDate, setEndDate] = useState<Date>(new Date(2025, 0, 27));
  const [category, setCategory] = useState('fashion');
  const [community, setCommunity] = useState('ppomppu');
  const [selectedEmphasis, setSelectedEmphasis] = useState<EmphasisType[]>([]);
  const [emphasisDetails, setEmphasisDetails] = useState<EmphasisItem[]>([]);
  const [emphasisInputs, setEmphasisInputs] = useState<Record<EmphasisType, string>>({
    '쿠폰': '',
    '이벤트': '',
    '특정 키워드': '',
    '기타': ''
  });
  const [bestCase, setBestCase] = useState('');
  const [isBestCaseOpen, setIsBestCaseOpen] = useState(false);

  const emphasisOptions: EmphasisType[] = ['쿠폰', '이벤트', '특정 키워드', '기타'];

  const toggleEmphasis = (emphasis: EmphasisType) => {
    if (selectedEmphasis.includes(emphasis)) {
      setSelectedEmphasis(selectedEmphasis.filter(e => e !== emphasis));
      setEmphasisDetails(emphasisDetails.filter(item => item.type !== emphasis));
      setEmphasisInputs(prev => ({ ...prev, [emphasis]: '' }));
    } else {
      setSelectedEmphasis([...selectedEmphasis, emphasis]);
    }
  };

  const addEmphasisDetail = (type: EmphasisType) => {
    if (emphasisInputs[type].trim()) {
      setEmphasisDetails([...emphasisDetails, { type, content: emphasisInputs[type] }]);
      setEmphasisInputs(prev => ({ ...prev, [type]: '' }));
    }
  };

  const removeEmphasisDetail = (index: number) => {
    setEmphasisDetails(emphasisDetails.filter((_, i) => i !== index));
  };

  const updateEmphasisInput = (type: EmphasisType, value: string) => {
    setEmphasisInputs(prev => ({ ...prev, [type]: value }));
  };

  const handleGenerate = () => {
    // Mock 데이터로 4개의 원고 생성
    const mockContents: GeneratedContent[] = [
      {
        id: 1,
        tone: '친근한 톤',
        text: `${productName} 이거 진짜 대박이에요 ㄷㄷ\n\n작년에 ${price}에 샀는데 지금 보니까 또 세일하네요.\n이 가격에 이 퀄리티면 가성비 ㅇㅈ?\n\n${emphasisDetails.map(e => e.content).join('\n')}\n\n놓치면 후회할 듯... 저는 재구매 각입니다 👍`
      },
      {
        id: 2,
        tone: '정보 전달형',
        text: `${productName} 특가 정보 공유합니다.\n\n가격: ${price}\n기간: ${startDate ? format(startDate, 'M월 d일', { locale: ko }) : ''} ~ ${endDate ? format(endDate, 'M월 d일', { locale: ko }) : ''}\n\n${emphasisDetails.map(e => `• ${e.content}`).join('\n')}\n\n비교해보니 역대급 가격인 것 같아서 올립니다.\n필요하신 분들 참고하세요!`
      },
      {
        id: 3,
        tone: '후기형',
        text: `${productName} 쓴지 3개월 됐는데 후기 남깁니다.\n\n솔직히 처음엔 ${price} 주고 사기 좀 망설였는데\n지금은 완전 만족 중이에요 ㅎㅎ\n\n${emphasisDetails.map(e => e.content).join('\n')}\n\n지금 또 세일한다길래 주변에 추천하려고 글 올려요.\n고민하시는 분들한테는 강추!`
      },
      {
        id: 4,
        tone: '유머러스한 톤',
        text: `${productName} ${price}이라니...\n\n(이거 사야되나 말아야되나 고민중)\n\n${emphasisDetails.map(e => e.content).join('\n')}\n\n지갑: 안돼...😭\n나: 어차피 살 거 지금 사는 게 이득 아니야?\n지갑: ...💸\n\n결국 또 질렀습니다 여러분 ㅋㅋㅋ\n같이 망하실 분? 🙋‍♀️`
      }
    ];

    setGeneratedContents(mockContents);
    setShowResults(true);
  };

  const getPlaceholder = (type: EmphasisType) => {
    switch(type) {
      case '쿠폰':
        return '예: 신규회원 20% 할인 쿠폰, 최대 5만원까지';
      case '이벤트':
        return '예: 첫 구매 시 추가 5,000원 할인 + 무료배송';
      case '특정 키워드':
        return '예: 한정수량, 조기품절, 인기상품';
      case '기타':
        return '상세 내용을 입력하세요';
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('원고가 복사되었습니다!');
  };

  const handleSaveAsBest = (text: string) => {
    toast.success('베스트 사례로 저장되었습니다!');
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="w-[1440px] h-[1024px] mx-auto bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-8 py-6 border-b bg-white/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBackToForm}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  입력 화면으로
                </Button>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-7 h-7 text-purple-600" />
                  <h1 className="text-purple-900">생성된 원고</h1>
                </div>
                <div className="w-32" /> {/* 균형을 위한 spacer */}
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  {productName} • {community === 'ppomppu' ? '뽐뿌' : community === 'fmkorea' ? '에펨코리아' : '여성시대'}
                </p>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 gap-6">
                {generatedContents.map((content) => (
                  <Card key={content.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">버전 {content.id}</Badge>
                          <span className="text-sm text-gray-600">{content.tone}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveAsBest(content.text)}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-h-[280px] max-h-[280px] overflow-y-auto">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {content.text}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => handleCopy(content.text)}
                        >
                          <Copy className="w-4 h-4" />
                          복사
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          수정
                        </Button>
                      </div>

                      {/* Engagement Preview */}
                      <div className="flex items-center gap-4 pt-2 text-xs text-gray-500 border-t">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>예상 반응도</span>
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-purple-600 h-1.5 rounded-full" 
                            style={{ width: `${70 + content.id * 5}%` }}
                          />
                        </div>
                        <span>{70 + content.id * 5}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleBackToForm}
                  className="px-8"
                >
                  새로운 원고 생성
                </Button>
                <Button
                  size="lg"
                  className="px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  다시 생성하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[1440px] h-[1024px] mx-auto bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="px-8 py-6 text-center border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-7 h-7 text-purple-600" />
            <h1 className="text-purple-900">커뮤니티 바이럴 콘텐츠 생성 시스템</h1>
          </div>
          <p className="text-sm text-gray-600">상품 정보를 입력하고 커뮤니티에 맞는 원고를 자동으로 생성하세요</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-5xl mx-auto">
            {/* Main Form */}
            <Card className="p-8 shadow-lg">
              <div className="space-y-6">
                
                {/* 기본 정보 */}
                <section>
                  <h2 className="mb-4 text-purple-900">기본 정보</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productName">상품명 *</Label>
                      <Input
                        id="productName"
                        placeholder="예: 나이키 에어맥스 270"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">가격 *</Label>
                      <Input
                        id="price"
                        placeholder="예: 89,000원"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <Separator />

                {/* 기간 선택 */}
                <section>
                  <h2 className="mb-4 text-purple-900">바이럴 기간</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>시작일 *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP', { locale: ko }) : '날짜 선택'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>종료일 *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP', { locale: ko }) : '날짜 선택'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* 카테고리 및 커뮤니티 */}
                <section>
                  <h2 className="mb-4 text-purple-900">타겟 설정</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>카테고리 *</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fashion">패션</SelectItem>
                          <SelectItem value="beauty">뷰티</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>타겟 커뮤니티 *</Label>
                      <Select value={community} onValueChange={setCommunity}>
                        <SelectTrigger>
                          <SelectValue placeholder="커뮤니티 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ppomppu">뽐뿌</SelectItem>
                          <SelectItem value="fmkorea">에펨코리아</SelectItem>
                          <SelectItem value="womad">여성시대</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* 강조 사항 */}
                <section>
                  <h2 className="mb-4 text-purple-900">강조 사항</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">강조 사항 종류 선택</Label>
                      <div className="flex flex-wrap gap-2">
                        {emphasisOptions.map((emphasis) => (
                          <Badge
                            key={emphasis}
                            variant={selectedEmphasis.includes(emphasis) ? 'default' : 'outline'}
                            className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                            onClick={() => toggleEmphasis(emphasis)}
                          >
                            {emphasis}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedEmphasis.length > 0 && (
                      <div className="space-y-4 p-5 bg-purple-50 rounded-lg border border-purple-100">
                        {selectedEmphasis.map((emphasisType) => (
                          <div key={emphasisType} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="px-3 py-1">
                                {emphasisType}
                              </Badge>
                              <Label className="text-sm">상세 내용 입력</Label>
                            </div>
                            <div className="flex gap-2">
                              <Textarea
                                placeholder={getPlaceholder(emphasisType)}
                                value={emphasisInputs[emphasisType]}
                                onChange={(e) => updateEmphasisInput(emphasisType, e.target.value)}
                                className="flex-1 bg-white"
                                rows={2}
                              />
                              <Button
                                onClick={() => addEmphasisDetail(emphasisType)}
                                variant="default"
                                className="self-start bg-purple-600 hover:bg-purple-700"
                                disabled={!emphasisInputs[emphasisType].trim()}
                              >
                                추가
                              </Button>
                            </div>
                            
                            {/* 추가된 강조사항 표시 */}
                            {emphasisDetails.filter(item => item.type === emphasisType).length > 0 && (
                              <div className="space-y-2">
                                {emphasisDetails
                                  .filter(item => item.type === emphasisType)
                                  .map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                                    >
                                      <span className="text-sm flex-1">{item.content}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeEmphasisDetail(
                                          emphasisDetails.findIndex(d => d === item)
                                        )}
                                      >
                                        삭제
                                      </Button>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <Separator />

                {/* 베스트 사례 - 선택사항 */}
                <section>
                  <Collapsible open={isBestCaseOpen} onOpenChange={setIsBestCaseOpen}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <h2 className="text-purple-900">베스트 사례 (선택사항)</h2>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-500 transition-transform ${isBestCaseOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="bestCase">
                          이전에 효과가 좋았던 원고 문구를 입력하세요
                        </Label>
                        <p className="text-sm text-gray-600 mb-3">
                          예: "이거 진짜 대박... 작년에 샀는데 아직도 잘 신고 있음. 이 가격에 이 퀄이면 가성비 ㅇㅈ?"
                        </p>
                        <Textarea
                          id="bestCase"
                          placeholder="좋은 반응을 얻었던 원고 문구나 표현 방식을 자유롭게 입력하세요. 여러 개를 작성해도 좋습니다."
                          value={bestCase}
                          onChange={(e) => setBestCase(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-xs text-gray-500">
                          💡 입력하신 베스트 사례는 AI 학습에 활용되어 더 나은 원고를 생성하는 데 도움이 됩니다.
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </section>

                <Separator />

                {/* 생성 버튼 */}
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    className="px-16 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleGenerate}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    원고 생성하기 (4개)
                  </Button>
                </div>
              </div>
            </Card>

            {/* Footer Info */}
            <div className="mt-6 mb-4 text-center text-sm text-gray-500">
              <p>* 필수 입력 항목을 모두 작성한 후 원고를 생성하세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
